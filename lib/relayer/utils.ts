export function checkRelayerAuth(relayer_auth: string): boolean {
  const RELAYERAUTHTOKEN = Deno.env.get("RELAYERAUTHTOKEN") || "";
  if (RELAYERAUTHTOKEN === "") {
    return false;
  }
  return relayer_auth === RELAYERAUTHTOKEN;
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
