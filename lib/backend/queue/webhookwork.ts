import { createClient } from "@supabase/supabase-js";
import {
  PaymentIntentRow,
  PaymentIntentStatus,
  WebhooksRow,
  ZapierWebhooksRow,
} from "../../enums.ts";
import { selectPaymentIntentRowByPaymentIntent } from "../db/tables/PaymentIntents.ts";
import { selectWebhooksForWorker } from "../db/tables/Webhooks.ts";
import { selectZapierWebhooksByPayeeId } from "../db/tables/ZapierWebhooks.ts";
import {
  AppLinks,
  EventType,
  MapCustomerEmailRequestType,
  MapMerchantEmailRequestType,
} from "../email/types.ts";
import { NewWebhookWorkerArgs } from "./kv.ts";
import { doSendMail } from "../email/utils/doSend.ts";
import { getEmailByUserId } from "../db/rpc.ts";
import {
  triggerCustomWebhook,
  triggerZapierWebhook,
} from "../webhooks/fetch.ts";
import { Currency } from "../../types/checkoutTypes.ts";
import {
  PaymentIntent_ZapierFormat,
  PaymentIntentStatus_ApiV1,
  Pricing_ApiV1,
} from "../../api_v1/types.ts";

export async function processWebhookwork(args: NewWebhookWorkerArgs) {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
    { auth: { persistSession: false } },
  );
  const ctx: any = {
    state: {
      supabaseClient: undefined,
    },
  };
  ctx.state.supabaseClient = client;
  const { eventType, paymentIntent } = args;
  // Fetch the payment intent's data!
  const { data: piRowData } = await selectPaymentIntentRowByPaymentIntent(ctx, {
    paymentIntent,
  });

  if (piRowData.length === 0) {
    // If We didn't find any data, just return here
    return;
  }
  const piRow = piRowData[0] as PaymentIntentRow;
  // Check if should send email!
  const shouldSendEmail = piRow.debit_item_id.email_notifications;
  let customerEmail = "";
  let merchantEmail = "";

  if (shouldSendEmail) {
    const { data: customerEmailData } = await getEmailByUserId(ctx, {
      userid: piRow.creator_user_id,
    });
    customerEmail = customerEmailData[0].email;

    const { data: merchantEmailData } = await getEmailByUserId(ctx, {
      userid: piRow.payee_user_id,
    });
    merchantEmail = merchantEmailData[0].email;
  }

  // Should we trigger the webhook of the merchant?

  const { data: webhookdata } = await selectWebhooksForWorker(
    ctx,
    piRow.debit_item_id.payee_id,
  );

  let shouldTriggerWebhook = false;
  if (webhookdata.length !== 0) {
    shouldTriggerWebhook = true;
  }
  const webhooksRow: WebhooksRow = webhookdata[0];

  const { data: zapierWebhookData } = await selectZapierWebhooksByPayeeId(ctx, {
    payeeId: piRow.debit_item_id.payee_id,
  });

  let zapierWebhooksExist = false;

  if (zapierWebhookData.length !== 0) {
    zapierWebhooksExist = true;
  }
  const zapierWebhookRow = zapierWebhookData[0] as ZapierWebhooksRow;

  switch (eventType) {
    case EventType.SubscriptionCreated:
      if (shouldSendEmail) {
        //both parties get an email!
        await sendEmailToBothParties(
          eventType,
          piRow.paymentIntent,
          customerEmail,
          merchantEmail,
        );
      }
      if (shouldTriggerWebhook && webhooksRow.on_subscription_created) {
        await triggerCustomWebhook({
          reason: eventType,
          authorization: webhooksRow._authorization_,
          url: webhooksRow.webhook_url,
          payment_intent: paymentIntent,
        });
      }
      if (
        zapierWebhooksExist &&
        zapierWebhookRow.subscription_created_url.length !== 0
      ) {
        await triggerZapierWebhook({
          zapierUrl: zapierWebhookRow.subscription_created_url,
          payment_intent_data: payment_intent_to_zapier_format(piRow),
        });
      }
      break;
    case EventType.SubscriptionCancelled:
      if (shouldSendEmail) {
        // both parties get an email
        await sendEmailToBothParties(
          eventType,
          piRow.paymentIntent,
          customerEmail,
          merchantEmail,
        );
      }
      if (shouldTriggerWebhook && webhooksRow.on_subscription_cancelled) {
        await triggerCustomWebhook({
          reason: eventType,
          authorization: webhooksRow._authorization_,
          url: webhooksRow.webhook_url,
          payment_intent: paymentIntent,
        });
      }
      if (
        zapierWebhooksExist &&
        zapierWebhookRow.subscription_cancelled_url.length !== 0
      ) {
        await triggerZapierWebhook({
          zapierUrl: zapierWebhookRow.subscription_cancelled_url,
          payment_intent_data: payment_intent_to_zapier_format(piRow),
        });
      }
      break;
    case EventType.SubscriptionEnded:
      //THIS IS A PAYMENT EVENT
      if (shouldSendEmail) {
        //Both parties get an email
        await sendEmailToBothParties(
          eventType,
          piRow.paymentIntent,
          customerEmail,
          merchantEmail,
        );
      }
      if (shouldTriggerWebhook && webhooksRow.on_payment_success) {
        await triggerCustomWebhook({
          reason: eventType,
          authorization: webhooksRow._authorization_,
          url: webhooksRow.webhook_url,
          payment_intent: paymentIntent,
        });
      }
      if (zapierWebhooksExist && zapierWebhookRow.payment_url.length !== 0) {
        await triggerZapierWebhook({
          zapierUrl: zapierWebhookRow.payment_url,
          payment_intent_data: payment_intent_to_zapier_format(piRow),
        });
      }
      break;
    case EventType.Payment:
      if (shouldSendEmail) {
        //parties get an email
        await sendEmailToBothParties(
          eventType,
          piRow.paymentIntent,
          customerEmail,
          merchantEmail,
        );
      }
      if (shouldTriggerWebhook && webhooksRow.on_payment_success) {
        await triggerCustomWebhook({
          reason: eventType,
          authorization: webhooksRow._authorization_,
          url: webhooksRow.webhook_url,
          payment_intent: paymentIntent,
        });
      }
      if (zapierWebhooksExist && zapierWebhookRow.payment_url.length !== 0) {
        await triggerZapierWebhook({
          zapierUrl: zapierWebhookRow.payment_url,
          payment_intent_data: payment_intent_to_zapier_format(piRow),
        });
      }
      break;
    case EventType.PaymentFailure:
      if (shouldSendEmail) {
        // If the failure reason is BALANCETOOLOWTORELAY then only the merchant gets an email!
        // Else the customer gets an email too
        if (piRow.statusText === PaymentIntentStatus.BALANCETOOLOWTORELAY) {
          await sendEmailToMerchant(
            eventType,
            piRow.paymentIntent,
            merchantEmail,
          );
        } else {
          // Send to both parties
          await sendEmailToBothParties(
            eventType,
            piRow.paymentIntent,
            customerEmail,
            merchantEmail,
          );
        }
      }
      if (shouldTriggerWebhook && webhooksRow.on_payment_failure) {
        await triggerCustomWebhook({
          reason: eventType,
          authorization: webhooksRow._authorization_,
          url: webhooksRow.webhook_url,
          payment_intent: paymentIntent,
        });
      }
      if (
        zapierWebhooksExist && zapierWebhookRow.payment_failure_url.length !== 0
      ) {
        await triggerZapierWebhook({
          zapierUrl: zapierWebhookRow.payment_failure_url,
          payment_intent_data: payment_intent_to_zapier_format(piRow),
        });
      }
      break;
    case EventType.DynamicPaymentRequestRejected:
      if (shouldSendEmail) {
        //Only the merchant receievs an email!
        await sendEmailToMerchant(
          eventType,
          piRow.paymentIntent,
          merchantEmail,
        );
      }
      if (
        shouldTriggerWebhook && webhooksRow.on_dynamic_payment_request_rejected
      ) {
        await triggerCustomWebhook({
          reason: eventType,
          authorization: webhooksRow._authorization_,
          url: webhooksRow.webhook_url,
          payment_intent: paymentIntent,
        });
      }
      if (
        zapierWebhooksExist &&
        zapierWebhookRow.dynamic_payment_request_rejected_url.length !== 0
      ) {
        await triggerZapierWebhook({
          zapierUrl: zapierWebhookRow.dynamic_payment_request_rejected_url,
          payment_intent_data: payment_intent_to_zapier_format(piRow),
        });
      }
      break;
    default:
      break;
  }
}

async function sendEmailToMerchant(
  eventType: EventType,
  paymentIntent: string,
  merchantEmail: string,
) {
  await doSendMail(
    MapMerchantEmailRequestType[eventType],
    {
      subscriptionLink: AppLinks.payeePaymentIntents + paymentIntent,
    },
    merchantEmail,
  );
}

async function sendEmailToBothParties(
  eventType: EventType,
  paymentIntent: string,
  customerEmail: string,
  merchantEmail: string,
) {
  await doSendMail(
    MapCustomerEmailRequestType[eventType],
    {
      subscriptionLink: AppLinks.createdPaymentIntents + paymentIntent,
    },
    customerEmail,
  );

  await doSendMail(MapMerchantEmailRequestType[eventType], {
    subscriptionLink: AppLinks.payeePaymentIntents + paymentIntent,
  }, merchantEmail);
}

function payment_intent_to_zapier_format(
  pi: PaymentIntentRow,
): PaymentIntent_ZapierFormat {
  const curr: Currency = JSON.parse(pi.currency);

  return {
    name: pi.debit_item_id.name,
    created_at: pi.created_at,
    payment_intent: pi.paymentIntent,
    status_text: pi.statusText as PaymentIntentStatus_ApiV1,
    payee_address: pi.payee_address,
    max_debit_amount: pi.maxDebitAmount,
    debit_times: pi.debitTimes,
    debit_interval: pi.debitInterval,
    last_payment_date: pi.lastPaymentDate === null ? "" : pi.lastPaymentDate,
    next_payment_date: pi.nextPaymentDate === null ? "" : pi.nextPaymentDate,
    pricing: pi.pricing as Pricing_ApiV1,
    currency_name: curr.name,
    native_currency: `${curr.native}`,
    currency_address: curr.contractAddress,
    network: pi.network,
    transactions_left: pi.debitTimes - pi.used_for,
    failed_dynamic_payment_amount: pi.failedDynamicPaymentAmount,
  };
}
