import { Handlers } from "$fresh/server.ts";
import {
  insertPaymentIntent,
  selectAccountByCommitment,
  selectItemByButtonId,
  updateItemPaymentIntentsCount,
} from "../../lib/backend/supabaseQueries.ts";
import { estimateRelayerGas } from "../../lib/backend/web3.ts";
import { PaymentIntentStatus, Pricing } from "../../lib/enums.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
  async POST(_req, ctx) {
    const json = await _req.json();

    const userid = ctx.state.userid;
    const item_button_id = json.button_id;
    const proof = json.proof;
    const publicSignals = json.publicSignals;
    const maxDebitAmount = json.maxDebitAmount;
    const debitTimes = json.debitTimes;
    const debitInterval = json.debitInterval;
    const paymentIntent = json.paymentIntent;
    const commitment = json.commitment;

    // Get the debit item using th button_id
    const { data: itemData, error: itemError } = await selectItemByButtonId(
      ctx.state.supabaseClient,
      item_button_id,
    );

    if (itemData === null || itemData.length === 0) {
      return new Response(null, { status: 500 });
    }

    const { data: accountData, error: accountError } =
      await selectAccountByCommitment(
        ctx.state.supabaseClient,
        commitment,
      );

    if (accountData === null || accountData.length === 0) {
      return new Response(null, { status: 500 });
    }

    const estimatedGas = await estimateRelayerGas({
      proof,
      publicSignals,
      payeeAddress: itemData[0].payee_address,
      maxDebitAmount,
      actualDebitedAmount: maxDebitAmount,
      debitTimes,
      debitInterval,
    }, itemData[0].network);
    // Now I save it to the database if it succeeds I return ok afterwards!
    const { data, error: insertError } = await insertPaymentIntent(
      ctx.state.supabaseClient,
      userid,
      itemData[0].payee_id,
      accountData[0].id,
      itemData[0].payee_address,
      maxDebitAmount,
      debitTimes,
      debitInterval,
      paymentIntent,
      commitment,
      estimatedGas.toString(),
      PaymentIntentStatus.CREATED,
      itemData[0].pricing,
      itemData[0].currency,
      itemData[0].network,
      itemData[0].id,
      proof,
      publicSignals,
    );

    if (insertError !== null) {
      return new Response(null, { status: 500 });
    }

    //Update the debit item with how many payment intents are related to it
    const { error } = await updateItemPaymentIntentsCount(
      ctx.state.supabaseClient,
      itemData[0].payment_intents_count + 1,
      item_button_id,
    );

    return new Response(null, { status: 200 });
  },
};
