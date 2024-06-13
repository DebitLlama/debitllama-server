import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import { updatDynamicPaymentRequestJobStatusTo } from "../../../lib/backend/db/tables/DynamicPaymentRequestJobs.ts";
import { EventType } from "../../../lib/backend/email/types.ts";
import { enqueueWebhookWork } from "../../../lib/backend/queue/kv.ts";
import { DynamicPaymentRequestJobsStatus } from "../../../lib/enums.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const json = await _req.json();
    const status: DynamicPaymentRequestJobsStatus = json.status;
    const id = json.id;

    if (
      status !== DynamicPaymentRequestJobsStatus.CREATED &&
      status !== DynamicPaymentRequestJobsStatus.COMPLETED &&
      status !== DynamicPaymentRequestJobsStatus.REJECETED
    ) {
      return v1Error("Invalid status", 400);
    }

    const res = await updatDynamicPaymentRequestJobStatusTo(ctx, {
      id,
      status,
    });

    if (status === DynamicPaymentRequestJobsStatus.REJECETED) {
      enqueueWebhookWork({
        eventType: EventType.DynamicPaymentRequestRejected,
        paymentIntent: json.paymentIntent,
      });
    }

    return new Response(JSON.stringify(res), { status: 200 });
  },
};
