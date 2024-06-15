import { HandlerContext } from "$fresh/server.ts";
import { lockDynamicPaymentRequestJobs } from "../../../lib/backend/db/tables/DynamicPaymentRequestJobs.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    await lockDynamicPaymentRequestJobs(ctx);
    return new Response(null, { status: 200 });
  },
};
