import { EventType } from "../email/types.ts";
import { initRelayerBalances } from "./relayerBalanceInit.ts";
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
  relayerBalanceInit = "relayerBalanceInit",
}

kv.listenQueue(async (msg: any) => {
  switch (msg.type as KvMessageType) {
    case KvMessageType.webhookEvent:
      await processWebhookwork(msg.content).catch(console.error);
      break;
    case KvMessageType.slackWebhook:
      await processSlackWebhook(msg.content);
      break;
    case KvMessageType.relayerBalanceInit:
      await initRelayerBalances(msg.content);
      break;
    default:
      console.error("Unknown message received:", msg);
      break;
  }
});

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

export interface RelayerBalanceInitArgs {
  user_id: string;
}

//TODO: RUN THIS FUNCTION WHEN? LOGIN?
//TODO: Maybe I refactor to fee sandwich only, if the tx value is too low, I offer a manual pull payment via UI with default fees
//TODO: THen maybe the new relayer balances wil be removed also
export async function enqueueRelayerBalancesInit(args: RelayerBalanceInitArgs) {
  await kv.enqueue({ type: KvMessageType.relayerBalanceInit, content: args });
}
