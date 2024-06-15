//TODO: add all relayer logic here!
//TODO: Make sure the relayer can only get the Subscriptions he is affiliated with

import { AccessTokensQuery, tokenExpired } from "../backend/db/auth.ts";
import { QueryCtx } from "../backend/db/utils.ts";

export function checkRelayerAuth(relayer_auth: string): boolean {
  const RELAYERAUTHTOKEN = Deno.env.get("RELAYERAUTHTOKEN") || "";
  if (RELAYERAUTHTOKEN === "") {
    return false;
  }
  return relayer_auth === RELAYERAUTHTOKEN;
}

export async function checkRelayerAuthAndGetUserId(
  relayer_auth: string,
  ctx: QueryCtx,
): Promise<{ valid: boolean; userid: string; reason: string }> {
  try {
    const tokenres = await AccessTokensQuery(
      ctx.state.supabaseClient,
      relayer_auth,
    );

    tokenExpired(tokenres.data[0]);
    return { valid: true, userid: tokenres.data[0].creator_id, reason: "" };
  } catch (err) {
    return { valid: false, userid: "", reason: "token invalid" };
  }
}

export function getTimeToLockDynamicPaymentRequest() {
  const env = Deno.env.get("ENVIRONMENT");
  //For dev I don't enforce a long time
  if (env === "development") {
    return new Date().toUTCString();
  } else {
    const HOUR = 1000 * 60 * 60;
    const anHourAgo = Date.now() - HOUR;
    return new Date(anHourAgo).toUTCString();
  }
}
