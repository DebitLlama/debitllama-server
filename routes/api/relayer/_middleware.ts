import { FreshContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import { checkRelayerAuthAndGetUserId } from "../../../lib/relayer/utils.ts";
import { State } from "../../_middleware.ts";

export async function handler(_req: Request, ctx: FreshContext<any, State>) {
  const relayer_auth = _req.headers.get("X-Relayer");

  if (relayer_auth === null) {
    return v1Error("Missing Relayer Authentication header", 401);
  }

  const checkedRelayer = await checkRelayerAuthAndGetUserId(relayer_auth, ctx);
  if (!checkedRelayer.valid) {
    return v1Error("Invalid Relayer Authentication header", 401);
  }
  
  ctx.state.userid = checkedRelayer.userid;
  return await ctx.next();
}
