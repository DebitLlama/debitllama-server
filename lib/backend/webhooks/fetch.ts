import {
  TriggerCustomWebhookArgs,
  TriggerSlackWebhook,
  TriggerZapierWebhookArgs,
} from "./types.ts";

export async function triggerCustomWebhook(args: TriggerCustomWebhookArgs) {
  return await fetch(args.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": args.authorization,
    },
    body: JSON.stringify({
      version: "v1",
      home: "https://debitllama.com",
      link:
        `https://debitllama.com/api/v1/payment_intents/${args.payment_intent}`,
      reason: args.reason,
    }),
  });
}

export async function triggerZapierWebhook(
  args: TriggerZapierWebhookArgs,
) {
  return await fetch(args.zapierUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([args.payment_intent_data]),
  });
}

export async function triggerSlackWebhook(args: TriggerSlackWebhook) {
  return await fetch(args.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text:
        `A new message from ${args.email}\nSubject: ${args.subject}\nMessage: ${args.message}`,
    }),
  });
}
