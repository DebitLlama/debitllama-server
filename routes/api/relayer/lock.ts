import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import { lockDynamicPaymentRequestJobs } from "../../../lib/backend/db/tables/DynamicPaymentRequestJobs.ts";
import { checkRelayerAuth } from "../../../lib/relayer/utils.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const relayer_auth = _req.headers.get("X-Relayer");
    if (relayer_auth === null) {
      return v1Error(
        "Missing Relayer Authentication header",
        401,
      );
    }
    
    if (checkRelayerAuth(relayer_auth)) {
      await lockDynamicPaymentRequestJobs(ctx);
      return new Response(null, { status: 200 });
    } else {
      return v1Error(
        "Invalid Relayer Authentication header",
        401,
      );
    }
  },
};
