/// <reference lib="deno.unstable" />

import "$std/dotenv/load.ts";

import { EventType } from "../lib/backend/email/types.ts";
import { enqueueWebhookWork } from "../lib/backend/queue/kv.ts";

function TestEnqueue() {
  enqueueWebhookWork({
    eventType: EventType.SubscriptionCreated,
    paymentIntent:
      "0x02f107e41419b79fa9c8e9226273cc076bb8562a5be883a634633bbf7d5d0ba2",
  });
}

TestEnqueue();
