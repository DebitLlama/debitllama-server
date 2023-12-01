import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import { updateAccountBalanceByCommitment } from "../../../lib/backend/db/tables/Accounts.ts";
import { updatePaymentIntentStatusAfterSuccess } from "../../../lib/backend/db/tables/PaymentIntents.ts";
import { updateNewRelayerBalanceByChainId } from "../../../lib/backend/db/tables/RelayerBalance.ts";
import { insertNewTx } from "../../../lib/backend/db/tables/RelayerHistory.ts";
import { EventType } from "../../../lib/backend/email/types.ts";
import { enqueueWebhookWork } from "../../../lib/backend/queue/kv.ts";
import { PaymentIntentStatus } from "../../../lib/enums.ts";
import { checkRelayerAuth } from "../../../lib/relayer/utils.ts";
import { ChainIds } from "../../../lib/shared/web3.ts";

export interface RelayingSuccessArgs {
  chainId: ChainIds;
  newRelayerBalance: string;
  payee_user_id: string;
  paymentIntentId: number;
  relayerBalanceId: number;
  submittedTransaction: string;
  allGasUsed: string;
  paymentAmount: string;
  currency: string;
  commitment: string;
  newAccountBalance: string;
  statusText: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  used_for: number;
  paymentIntent: string;
}

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const relayer_auth = _req.headers.get("X-Relayer");
    if (relayer_auth === null) {
      return v1Error(
        "Missing Relayer Authentication header",
        401,
      );
    }

    if (checkRelayerAuth(relayer_auth)) {
      const json = await _req.json();

      const {
        chainId,
        newRelayerBalance,
        payee_user_id,
        paymentIntentId,
        relayerBalanceId,
        submittedTransaction,
        allGasUsed,
        paymentAmount,
        currency,
        commitment,
        newAccountBalance,
        statusText,
        lastPaymentDate,
        nextPaymentDate,
        used_for,
        paymentIntent,
      } = json as RelayingSuccessArgs;

      await updateNewRelayerBalanceByChainId(ctx, chainId, {
        newBalance: newRelayerBalance,
        payee_user_id,
      });

      await insertNewTx(ctx, {
        payee_user_id,
        paymentIntentId,
        relayerBalanceId,
        submittedTransaction,
        allGasUsed,
        paymentAmount,
        paymentCurrency: currency,
        network: chainId,
      });

      await updateAccountBalanceByCommitment(ctx, {
        newAccountBalance,
        commitment,
      });

      await updatePaymentIntentStatusAfterSuccess(ctx, {
        statusText,
        lastPaymentDate,
        nextPaymentDate,
        used_for,
        paymentIntentRowId: paymentIntentId,
      });

      enqueueWebhookWork({
        eventType: statusText === PaymentIntentStatus.PAID
          ? EventType.SubscriptionEnded
          : EventType.Payment,
        paymentIntent,
      });
    } else {
      return v1Error(
        "Invalid Relayer Authentication header",
        401,
      );
    }
  },
};
