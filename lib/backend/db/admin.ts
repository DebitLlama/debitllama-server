import { responseHandler, unwrapContext } from "./utils.ts";

// SELECT QUERIES!

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

// INSERT QUERIES

export async function insertNewAccessToken(
  ctx: any,
  args: {
    access_token: string;
    expiryDate: string;
  },
) {
  const { client, userid } = unwrapContext(ctx);
  const created_at = new Date().toUTCString();
  const res = await client.from("ApiAuthTokens")
    .insert({
      created_at,
      access_token: args.access_token,
      creator_id: userid,
      expiry_date_utc: args.expiryDate,
    }).select()
    .eq("created_at", created_at)
    .eq("creator_id", userid);

  return responseHandler(res, {
    rpc: "insertNewAccessToken",
    args: { ...args, userid },
  });
}

// UPDATE QUERIES

export async function updateItemEmailNotifications(
  ctx: any,
  args: {
    button_id: string;
    email_notifications: boolean;
  },
) {
  const { client, userid } = unwrapContext(ctx);

  const res = await client.from("Items").update({
    email_notifications: args.email_notifications,
  }).eq("button_id", args.button_id)
    .eq("payee_id", userid);

  return responseHandler(res, {
    rpc: "updateItemEmailNotifications",
    args: { ...args, userid },
  });
}

export async function updateItemRedirectUrl(
  ctx: any,
  args: {
    redirect_url: string;
    button_id: string;
  },
) {
  const { client, userid } = unwrapContext(ctx);

  const res = await client.from("Items").update({
    redirect_url: args.redirect_url,
  }).eq("button_id", args.button_id)
    .eq("payee_id", userid);

  return responseHandler(res, {
    rpc: "updateItemEmailNotifications",
    args: { ...args, userid },
  });
}

// DELETE QUERIES

export async function deleteWebhookData(ctx: any) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("Webhooks")
    .delete().eq("creator_id", userid);
  return responseHandler(res, {
    rpc: "deleteWebhookData",
    args: { userid },
  });
}
