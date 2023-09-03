import { Handlers } from "$fresh/server.ts";
import { estimateRelayerGas } from "../../lib/backend/web3.ts";
import { PaymentIntentStatus } from "../../lib/paymentIntentStatus.ts";
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
    const { data: itemData, error: itemError } = await ctx.state.supabaseClient
      .from("Items").select().eq("button_id", item_button_id);

    if (itemData === null || itemData.length === 0) {
      return new Response(null, { status: 500 });
    }

    const { data: accountData, error: accountError } = await ctx.state
      .supabaseClient.from("Accounts").select().eq("commitment", commitment);

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

    // Now I save it to the database and return ok
    const { data, error: insertError } = await ctx.state.supabaseClient.from(
      "PaymentIntents",
    ).insert({
      created_at: new Date().toISOString(),
      creator_user_id: userid,
      payee_user_id: itemData[0].payee_id,
      account_id: accountData[0].id,
      payee_address: itemData[0].payee_address,
      maxDebitAmount: maxDebitAmount,
      debitTimes,
      debitInterval,
      paymentIntent,
      commitment,
      estimatedGas: estimatedGas.toString(),
      statusText: PaymentIntentStatus.CREATED,
      lastPaymentDate: null,
      nextPaymentDate: null,
      pricing: itemData[0].pricing,
      currency: itemData[0].currency,
      network: itemData[0].network,
      debit_item_id: itemData[0].id,
    });

    if (insertError !== null) {
      return new Response(null, { status: 500 });
    }

    //Update the debit item with how many payment intents are related to it
    const { error } = await ctx.state.supabaseClient.from("Items").update({
      payment_intents_count: itemData[0].payment_intents_count + 1,
    }).eq("button_id", item_button_id);

    return new Response(null, { status: 200 });
  },
};
