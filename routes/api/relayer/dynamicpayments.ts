import { HandlerContext } from "$fresh/server.ts";
import { selectDynamicPaymentRequestJobWhereStatusIsLocked } from "../../../lib/backend/db/tables/DynamicPaymentRequestJobs.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const res = await selectDynamicPaymentRequestJobWhereStatusIsLocked(ctx);
    return new Response(JSON.stringify(res), { status: 200 });
  },
};
