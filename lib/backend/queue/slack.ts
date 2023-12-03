import { triggerSlackWebhook } from "../webhooks/fetch.ts";
import { SlackNotificationArgs } from "./kv.ts";

export async function processSlackWebhook(args: SlackNotificationArgs) {
  const slackWebhookUrl = Deno.env.get("SLACKFEEDBACKSURL") || "";
  if (slackWebhookUrl === undefined) {
    return;
  }
  await triggerSlackWebhook({
    url: slackWebhookUrl,
    subject: args.subject,
    message: args.message,
    email: args.email,
  });
  return;
}
