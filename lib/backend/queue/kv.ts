import { EventType } from "../email/types.ts";
import { processWebhookwork } from "./webhookwork.ts";

// Get a reference to a KV instance
export const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  if (isWebhookEvent(msg)) {
    console.log("SENDING WEBHOOK EVENT");
    await processWebhookwork(msg).catch(console.error);
  } else {
    // If the message is of an unknown type, it might be an error
    console.error("Unknown message received:", msg);
  }
});

// Create a type guard to check the type of the incoming message
function isWebhookEvent(o: unknown): o is NewWebhookWorkerArgs {
  return (
    ((o as NewWebhookWorkerArgs)?.eventType !== undefined &&
      typeof (o as NewWebhookWorkerArgs).eventType === "string") &&
    ((o as NewWebhookWorkerArgs)?.paymentIntent !== undefined &&
      typeof (o as NewWebhookWorkerArgs).paymentIntent === "string")
  );
}

export interface NewWebhookWorkerArgs {
  eventType: EventType;
  paymentIntent: string;
}

export async function enqueueWebhookWork(args: NewWebhookWorkerArgs) {
  await kv.enqueue(args);
}
