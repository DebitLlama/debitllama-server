import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import { updatDynamicPaymentRequestJobStatusTo } from "../../../lib/backend/db/tables/DynamicPaymentRequestJobs.ts";
import { DynamicPaymentRequestJobsStatus } from "../../../lib/enums.ts";
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
      return new Response(JSON.stringify(res), { status: 200 });
    } else {
      return v1Error(
        "Invalid Relayer Authentication header",
        401,
      );
    }
  },
};
