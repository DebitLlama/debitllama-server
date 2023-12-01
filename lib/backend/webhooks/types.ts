import { PaymentIntent_ZapierFormat } from "../../api_v1/types.ts";
import { EventType } from "../email/types.ts";

export type TriggerCustomWebhookArgs = {
  reason: EventType;
  url: string;
  authorization: string;
  payment_intent: string;
};

export type TriggerZapierWebhookArgs = {
  zapierUrl: string;
  payment_intent_data: PaymentIntent_ZapierFormat;
};
