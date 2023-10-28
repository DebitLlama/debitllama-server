import { responseHandler, unwrapContext } from "./utils.ts";

export async function insertFeedback(
  ctx: any,
  args: { subject: string; message: string },
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.rpc("insert_new_feedback", {
    user_id: userid,
    subject: args.subject,
    message: args.message,
    created: new Date().toUTCString(),
  });

  return responseHandler(res, {
    rpc: "insertFeedback",
    args,
  });
}

export async function selectBuyitnowAccounts(ctx: any, args: {
  networkId: string;
  currency: string;
  button_id: string;
}) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.rpc(
    "select_buyitnow_account_increment_impression",
    {
      userid: userid,
      networkid: args.networkId,
      curr: args.currency,
      button_id: args.button_id,
    },
  );
  return responseHandler(res, {
    rpc: "select_buyitnow_account_increment_impression",
    args,
  });
}

export async function selectItem(ctx: any, args: {
  buttonid: string;
}) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.rpc("select_item", {
    buttonid: args.buttonid,
    payeeid: userid,
  });
  return responseHandler(res, {
    rpc: "select_item",
    args: { ...args, userid },
  });
}

export async function getEmailByUserId(ctx: any, args: { userid: string }) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.rpc("get_email_by_user_uuid2", {
    user_id: args.userid,
  });
  return responseHandler(res, {
    rpc: "getEmailByUserId",
    args: { ...args, userid },
  });
}
