import { EventType } from "../email/types.ts";
import { processSalesMail } from "./sendEmail.ts";
import { processSlackWebhook } from "./slack.ts";
import { processWebhookwork } from "./webhookwork.ts";

// Get a reference to a KV instance
export const kv = await Deno.openKv();

export type KvMessage = {
  content: any;
  type: KvMessageType;
};

export enum KvMessageType {
  webhookEvent = "webhookEvent",
  slackWebhook = "slackWebhook",
  salesEmail = "salesEmail",
}

if (!Deno.args.includes("build")) {
  kv.listenQueue(async (msg: any) => {
    switch (msg.type as KvMessageType) {
      case KvMessageType.webhookEvent:
        await processWebhookwork(msg.content).catch(console.error);
        break;
      case KvMessageType.slackWebhook:
        await processSlackWebhook(msg.content);
        break;
      case KvMessageType.salesEmail:
        await processSalesMail(msg.content);
        break;
      default:
        console.error("Unknown message received:", msg);
        break;
    }
  });
}

export interface NewWebhookWorkerArgs {
  eventType: EventType;
  paymentIntent: string;
}

export async function enqueueWebhookWork(args: NewWebhookWorkerArgs) {
  await kv.enqueue({ type: KvMessageType.webhookEvent, content: args });
}

export interface SlackNotificationArgs {
  isSlackWebhook: boolean;
  slackWebhookUrl: string;
  subject: string;
  message: string;
  email: string;
}

export async function enqueueSlackNotification(args: SlackNotificationArgs) {
  await kv.enqueue({ type: KvMessageType.slackWebhook, content: args });
}

export interface SalesEmailArgs {
  name: string;
  message: string;
  email: string;
  website: string;
}

export async function enqueueSalesEmail(args: SalesEmailArgs) {
  await kv.enqueue({ type: KvMessageType.salesEmail, content: args });
}
