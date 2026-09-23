import { HandlerContext } from "$fresh/server.ts";
import {
  parseFilter,
  PaymentIntentsReponseBuilder,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  checksPaymentIntents_filterKeys,
  EndpointNames_ApiV1,
  Filter,
  getPaymentIntentsSortBy,
  getSortableColumns,
  mapPaymentIntentSortByKeysToDBColNames,
  PaymentIntents_filterKeys,
  PaymentIntents_sortyBy,
} from "../../../../lib/api_v1/types.ts";
import {
  getPagination,
  getTotalPages,
} from "../../../../lib/backend/businessLogic.ts";
import { selectAllPaymentIntentsAPIV1 } from "../../../../lib/backend/db/v1.ts";
import { State } from "../../../_middleware.ts";
import QueryBuilder from "../../../../lib/backend/db/queryBuilder.ts";
import { enqueueWebhookWork } from "../../../../lib/backend/queue/kv.ts";
import { EventType } from "../../../../lib/backend/email/types.ts";
import {
  AccountTypes,
  PaymentIntentStatus,
  Pricing,
} from "../../../../lib/enums.ts";
import {
  estimateRelayerGas,
  getAccount,
  parseEther,
  parseUnits,
} from "../../../../lib/backend/web3.ts";
import { getTokenDecimals } from "../../../../lib/shared/web3.ts";

/** BigNumber to hex string of specified length */
export function toNoteHex(number: Buffer | any, length = 32) {
  const str = number instanceof Buffer
    ? number.toString("hex")
    : BigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

export const handler = {
  async GET(_req: Request, ctx: HandlerContext<any, State>) {
    //Return all payment intents paginated!
    const url = new URL(_req.url);

    const current_pageQ = url.searchParams.get("current_page") || "0";
    const page_sizeQ = url.searchParams.get("page_size") || "10";
    const sort_by = url.searchParams.get("sort_by") || "created_at";
    const sort_direction = url.searchParams.get("sort_direction") || "DESC";
    const filterQ = url.searchParams.get("filter") || "{}";

    try {
      const current_page = parseInt(current_pageQ);
      if (isNaN(current_page)) {
        // Return an error! validation failed!
        throw new Error("Invalid current_page parameter. Must be integer");
      }
      const page_size = parseInt(page_sizeQ);
      if (isNaN(page_size)) {
        throw new Error("Invalid page_size parameter. Must be integer");
      }
      if (sort_direction !== "DESC" && sort_direction !== "ASC") {
        throw new Error("Invalid sort_direction. Must be ASC or DESC");
      }
      const getSortBy =
        getPaymentIntentsSortBy[sort_by as PaymentIntents_sortyBy];
      if (!getSortBy) {
        throw new Error("Invalid SortBy parameter! Column not found");
      }

      const filter = parseFilter(filterQ);
      const appliedFilters: Filter[] = [];
      const filterParameters = Object.entries(filter).map((a) => {
        if (
          checksPaymentIntents_filterKeys[a[0] as PaymentIntents_filterKeys]
        ) {
          // I push the unmapped filtes int an extarnal array
          appliedFilters.push({
            parameter: a[0],
            value: a[1] as string,
          });

          //I need to map the filter keys parameters to database column compatible names!!
          // Using a mapping I made for sortBy, which is compatible with filterKeys, just contains more things
          return {
            parameter: mapPaymentIntentSortByKeysToDBColNames[
              a[0] as PaymentIntents_sortyBy
            ],
            value: a[1],
          };
        }
      });

      const { from, to } = getPagination(
        current_page,
        page_size,
      );

      const allPaymentIntents = await selectAllPaymentIntentsAPIV1(ctx, {
        order: sort_by,
        ascending: sort_direction === "ASC",
        rangeFrom: from,
        rangeTo: to,
        filter: filterParameters as Array<{ parameter: string; value: string }>,
      });
      if (allPaymentIntents.error) {
        throw new Error(
          allPaymentIntents.error.message + ". " +
            allPaymentIntents.error.details,
        );
      }

      const total_pages = getTotalPages(allPaymentIntents.count, page_size);

      return v1Success(PaymentIntentsReponseBuilder({
        returnError: false,
        error: {
          message: "",
          status: 0,
          timestamp: "",
        },
        allPaymentIntents: allPaymentIntents.data,
        pagination: {
          current_page,
          total_pages,
          page_size,
          sort_by,
          sort_direction,
          sortable_columns:
            getSortableColumns[EndpointNames_ApiV1.paymentIntents],
        },
        filters: appliedFilters,
      }));
    } catch (err: any) {
      const error = {
        message: err.message,
        status: 400,
        timestamp: new Date().toUTCString(),
      };
      return v1Error(
        PaymentIntentsReponseBuilder({
          error,
          returnError: true,
          allPaymentIntents: [],
          pagination: {},
          filters: [],
        }),
        error.status,
      );
    }
  },
  async POST(_req: Request, ctx: HandlerContext<any, State>) {
    try {
      const userid = ctx.state.userid;
      const json = await _req.json();

      const checkoutId: string = json.checkout_id;
      if (!checkoutId || typeof json.payload !== "string") {
        return new Response(null, { status: 400 });
      }

      const { proof, publicSignals, publicInputs } =
        deserializePaymentIntentSubmission(json.payload);

      // Proof validity is enforced by estimateRelayerGas below: it simulates the
      // on-chain call including the verifier, so a bad proof makes that call
      // throw/revert. No separate verification step needed here.
      //
      // publicInputs is typed and came straight from createPaymentIntent client
      // side — no array-index guessing. IMPORTANT: publicInputs itself is NOT
      // proof-bound. The values actually enforced against the proof are inside
      // `publicSignals`/`proof`, whatever the relayer/verifier contract does
      // with them. If estimateRelayerGas (or the contract it calls) uses
      // publicInputs.maxDebitAmount/payee/etc. as explicit call params rather
      // than deriving them from the verified publicSignals, confirm the
      // contract asserts those params equal the corresponding public signals —
      // otherwise a client could send a valid proof for one set of terms
      // alongside a mismatched publicInputs struct.
      const commitment = publicInputs.commitment.toString();
      const paymentIntentId = publicInputs.paymentIntent.toString();
      const payeeAddress = publicInputs.payee;
      const maxDebitAmount = publicInputs.maxDebitAmount;
      const debitTimes = publicInputs.debitTimes;
      const debitInterval = publicInputs.debitInterval;

      const queryBuilder = new QueryBuilder(ctx);
      const select = queryBuilder.select();
      const insert = queryBuilder.insert();

      // ASSUMPTION — confirmed by you: this is byButtonId, called with checkoutId.
      console.log("Fetching by button ID before");
      const { data: itemData } = await select.Items.byButtonId(checkoutId);
      console.log("Fetching by button ID after");
      if (!itemData || itemData.length === 0) {
        return new Response(null, { status: 404 });
      }
      const item = itemData[0];

      // publicInputs is not proof-bound (see note above), so cross-check it
      // against the item's own stored terms — data the client can't influence.
      // A mismatch here means the client is claiming different terms than what
      // this item actually charges, whether or not the proof itself is valid.
      if (item.payee_address !== payeeAddress) {
        return new Response(null, { status: 400 });
      }

      // item.debit_times/debit_interval come back as BigInt/Decimal columns —
      // likely strings at runtime — so compare numerically rather than with
      // strict equality, which would wrongly reject e.g. 5 !== "5".
      if (Number(item.debit_times) !== debitTimes) {
        return new Response(null, { status: 400 });
      }
      console.log("3");

      if (Number(item.debit_interval) !== debitInterval) {
        return new Response(null, { status: 400 });
      }
      const { data: accountData } = await select.Accounts.byCommitment(
        toNoteHex(commitment),
      );


      if (!accountData || accountData.length === 0) {
        return new Response(null, { status: 404 });
      }
      const account = accountData[0];

      // Ownership check (this was a bare TODO before): the authenticated caller
      // must actually own the account paying for the intent.
      if (account.user_id !== userid) {
        return new Response(null, { status: 403 });
      }

      if (account.closed) {
        return new Response(null, { status: 409 });
      }

      //Fetch the account decimals...

      // Check the network first, so the decimals we look up are the right ones
      // for both the account and the item.
      if (item.network !== account.network_id) {
        return new Response(null, { status: 400 });
      }

      const currency = JSON.parse(account.currency);
      const decimals = getTokenDecimals(
        account.network_id,
        currency.contractAddress,
      );

      // maxDebitAmount is already in token base units (e.g. 20000 for 0.02 USDC).
      // item.max_price is stored as a human-readable decimal (e.g. "0.02"),
      // so scale it by the token's decimals before comparing.
      const debitAmount = parseUnits(maxDebitAmount.toString(), 0);
      const itemPrice = parseUnits(item.max_price.toString(), decimals);

      if (item.pricing === Pricing.Fixed) {
        // Fixed pricing: the debited amount must match the item exactly.
        if (debitAmount !== itemPrice) {
          return new Response(null, { status: 400 });
        }
      } else {
        // ASSUMPTION — treating item.max_price as a hard cap for variable pricing.
        if (debitAmount > itemPrice) {
          return new Response(null, { status: 400 });
        }
      }

      if (item.network !== account.network_id) {
        return new Response(null, { status: 400 });
      }

      // Sync cached balance with on-chain state before checking funds.
      // Skipped for connected wallets, same as the original logic.
      if (account.accountType !== AccountTypes.CONNECTEDWALLET) {
        const onChainAccount = await getAccount(
          commitment,
          item.network,
          account.accountType,
        );
        if (parseEther(account.balance) !== onChainAccount.account[3]) {
          const update = queryBuilder.update();
          await update.Accounts.balanceAndClosedById(
            onChainAccount.account[3],
            !onChainAccount.account[0],
            account.id,
          );
          account.balance = onChainAccount.account[3];
          account.closed = !onChainAccount.account[0];
        }
      }

      if (account.closed) {
        console.log("Account is closed?");
        return new Response(null, { status: 409 });
      }

      // Gas estimate will fail if the account lacks funds — only relevant for
      // fixed-price virtual-account debits, where we know the exact amount upfront.
      const getActualDebitedAmount =
        account.accountType === AccountTypes.VIRTUALACCOUNT &&
          item.pricing === Pricing.Fixed
          ? maxDebitAmount
          : "0";

      let estimatedGas: bigint;

      try {
        estimatedGas = await estimateRelayerGas(
          {
            proof,
            publicSignals: publicSignals, //I stringify because internally there is a parse that is used from another place
            payeeAddress: item.payee_address,
            maxDebitAmount,
            actualDebitedAmount: getActualDebitedAmount,
            debitTimes,
            debitInterval,
          },
          item.network,
          account.accountType,
        );
      } catch (gasErr) {
        // A revert here most likely means the proof failed verification
        // on-chain (or genuinely insufficient funds — those two cases are
        // presumably indistinguishable from the revert alone, since virtual
        // account balance was already checked above for fixed pricing).
        console.log(gasErr)
        console.error(
          "estimateRelayerGas reverted — treating as invalid proof" );
        return new Response(null, { status: 400 });
      }

      const stringifyBigint = (value: unknown): string =>
        JSON.stringify(
          value,
          (_key, v) => (typeof v === "bigint" ? v.toString() : v),
        );

      // console.log("WAS ABLE TO ESTIMATE GAS:", estimatedGas);

      const { data: insertedIntent, error: insertError } = await insert
        .PaymentIntent
        .newPaymentIntent(
          item.payee_id,
          account.id,
          item.payee_address,
          maxDebitAmount,
          debitTimes.toString(),
          debitInterval.toString(),
          paymentIntentId,
          commitment,
          "0",//estimatedGas.toString(),
          PaymentIntentStatus.CREATED,
          item.pricing,
          item.currency,
          item.network,
          item.id,
          stringifyBigint(proof),
          stringifyBigint(publicSignals),
        );

      if (insertError !== null) {
        console.log("LOGGING INSERT ERROR");
        console.log(insertError);
        return new Response(null, { status: 500 });
      }

      enqueueWebhookWork({
        eventType: EventType.SubscriptionCreated,
        paymentIntent: insertedIntent?.id ?? paymentIntentId,
      });

      return new Response(JSON.stringify({ redirect_url: item.redirect_url }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch (err: any) {
      console.log(err.message);
      console.error("POST /payment_intents failed");
      return new Response(null, { status: 500 });
    }
  },
};

function deserializeFullProof(json: string): FullProof {
  const parsed = JSON.parse(json);
  const toBig = (arr: string[]): bigint[] => arr.map(BigInt);

  return {
    proof: {
      pi_a: toBig(parsed.proof.pi_a),
      pi_b: parsed.proof.pi_b.map(toBig),
      pi_c: toBig(parsed.proof.pi_c),
      protocol: parsed.proof.protocol,
      curve: parsed.proof.curve,
    },
    publicSignals: parsed.publicSignals, // leave as-is, or BigInt() selectively
  };
}

export type FullProof = {
  proof: Proof;
  publicSignals: Array<any>;
};

export type Proof = {
  pi_a: BigNumberish[];
  pi_b: BigNumberish[][];
  pi_c: BigNumberish[];
  protocol: string;
  curve: string;
};

export type SolidityProof = [
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
];
export type BigNumberish = string | bigint;

/**
 * Makes a proof compatible with the Verifier.sol method inputs.
 * @param proof The proof generated with SnarkJS.
 * @returns The Solidity compatible proof.
 */
export function packToSolidityProof(proof: Proof): SolidityProof {
  return [
    proof.pi_a[0],
    proof.pi_a[1],
    proof.pi_b[0][1],
    proof.pi_b[0][0],
    proof.pi_b[1][1],
    proof.pi_b[1][0],
    proof.pi_c[0],
    proof.pi_c[1],
  ];
}

export function deserializePaymentIntentSubmission(
  json: string,
): PaymentIntentSubmission {
  const parsed = JSON.parse(json);
  const toBig = (arr: string[]): bigint[] => arr.map(BigInt);

  return {
    proof: {
      pi_a: toBig(parsed.proof.pi_a),
      pi_b: parsed.proof.pi_b.map(toBig),
      pi_c: toBig(parsed.proof.pi_c),
      protocol: parsed.proof.protocol,
      curve: parsed.proof.curve,
    },
    publicSignals: parsed.publicSignals,
    publicInputs: {
      commitment: BigInt(parsed.publicInputs.commitment),
      paymentIntent: BigInt(parsed.publicInputs.paymentIntent),
      payee: parsed.publicInputs.payee,
      maxDebitAmount: parsed.publicInputs.maxDebitAmount,
      debitTimes: parsed.publicInputs.debitTimes,
      debitInterval: parsed.publicInputs.debitInterval,
    },
  };
}

export type PaymentIntentSubmission = {
  proof: Proof;
  publicSignals: Array<any>;
  publicInputs: PaymentIntentPublicSignals;
};

export type PaymentIntentPublicSignals = {
  commitment: bigint;
  paymentIntent: bigint;
  payee: string;
  maxDebitAmount: string;
  debitTimes: number;
  debitInterval: number;
};
