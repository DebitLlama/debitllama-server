// SELECT QUERIES!

import { responseHandler, unwrapContext } from "../utils.ts";

export async function selectWebhooksByUserid(
  ctx: any,
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("Webhooks")
    .select("*")
    .eq("creator_id", userid);

  return responseHandler(res, {
    rpc: "getWebhooksByUserid",
    args: { userid },
  });
}

export async function deleteWebhookData(ctx: any) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("Webhooks")
    .delete().eq("creator_id", userid);
  return responseHandler(res, {
    rpc: "deleteWebhookData",
    args: { userid },
  });
}

export async function selectWebhooksForWorker(ctx: any, userId: string) {
  const { client } = unwrapContext(ctx);
  const res = await client.from("Webhooks")
    .select("*")
    .eq("creator_id", userId);
  return responseHandler(res, {
    rpc: "selectWebhooksForWorker",
    args: { userId },
  });
}
