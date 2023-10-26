import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { getEmailByUserId } from "../../lib/backend/db/rpc.ts";
import { estimateRelayerGas } from "../../lib/backend/web3.ts";
import { sendPaymentIntentCreatedEmail } from "../../lib/email/doSend.ts";
import { AccountTypes, PaymentIntentStatus, Pricing } from "../../lib/enums.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
  async POST(_req, ctx) {
    const json = await _req.json();

    const item_button_id = json.button_id;
    const proof = json.proof;
    const publicSignals = json.publicSignals;
    const maxDebitAmount = json.maxDebitAmount;
    const debitTimes = json.debitTimes;
    const debitInterval = json.debitInterval;
    const paymentIntent = json.paymentIntent;
    const commitment = json.commitment;
    const queryBuilder = new QueryBuilder(ctx);
    const select = queryBuilder.select();
    const insert = queryBuilder.insert();
    const update = queryBuilder.update();
    //TODO: RPC CALL!!
    // Get the debit item using th button_id
    const { data: itemData } = await select.Items.byButtonId(
      item_button_id,
    );

    if (itemData === null || itemData.length === 0) {
      return new Response(null, { status: 500 });
    }

    const { data: accountData } = await select.Accounts.byCommitment(
      commitment,
    );

    if (accountData === null || accountData.length === 0) {
      return new Response(null, { status: 500 });
    }

    // This estimate gas will fail if the account don't have enough balance, which is something I only check for for fixed payments from virtual accounts
    // The gas will be estimated using zero as an actualDebitedAmount so the call should succeed even if the account is currently empty!
    const getActualDebitedAmount =
      accountData[0].accountType === AccountTypes.VIRTUALACCOUNT &&
        itemData[0].pricing === Pricing.Fixed
        ? maxDebitAmount
        : "0";

    //TODO: Maybe these gas pre-estimations I'm not using for anything right now..

    const estimatedGas = await estimateRelayerGas(
      {
        proof,
        publicSignals,
        payeeAddress: itemData[0].payee_address,
        maxDebitAmount,
        actualDebitedAmount: getActualDebitedAmount,
        debitTimes,
        debitInterval,
      },
      itemData[0].network,
      accountData[0].accountType,
    );

    //TODO: REFACTO THIS TO BE 1 RPC CALL!
    // Now I save it to the database if it succeeds I return ok afterwards!
    const { error: insertError } = await insert.PaymentIntent
      .newPaymentIntent(
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
        itemData[0].relayerBalance_id.id,
      );

    if (insertError !== null) {
      return new Response(null, { status: 500 });
    }

    // Send an email to the creator of the payment intent to notify him that it was saved!
    //TODO: REFACTOR THIS TO BE 1 RPC CALL
    const customerEmailData = await getEmailByUserId(
      ctx,
      { userid: ctx.state.userid as string },
    );
    const payeeEmailData = await getEmailByUserId(ctx, {
      userid: itemData[0].payee_id,
    });
    //TODO: SEND THE EMAIL VIA TRIGGER!
    // REFACTOR THIS TO USE SERVERLESS FUNC!
    //THEN I CAN FORGET ABOUT GETTING THE EMAILS HERE ALSO!! NICE!
    await sendPaymentIntentCreatedEmail(
      customerEmailData.data[0].email,
      payeeEmailData.data[0].email,
      paymentIntent,
    );

    //Update the debit item with how many payment intents are related to it
    await update.Items.paymentIntentsCountByButtonId(
      itemData[0].payment_intents_count + 1,
      item_button_id,
    );

    return new Response(null, { status: 200 });
  },
};
