import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import {
  selectAllRelayerBalances,
} from "../../../lib/backend/db/tables/RelayerBalance.ts";
import { checkRelayerAuth } from "../../../lib/relayer/utils.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext) {
    const relayer_auth = _req.headers.get("X-Relayer");
    if (relayer_auth === null) {
      return v1Error(
        "Missing Relayer Authentication header",
        401,
      );
    }

    if (checkRelayerAuth(relayer_auth)) {
      const url = new URL(_req.url);
      const payee_id = url.searchParams.get("payee_id");

      if (!payee_id) {
        return v1Error("Invalid Userid", 401);
      }
      const res = await selectAllRelayerBalances(ctx, {});

      return new Response(JSON.stringify(res), { status: 200 });
    } else {
      return v1Error(
        "Invalid Relayer Authentication header",
        401,
      );
    }
  },
};
