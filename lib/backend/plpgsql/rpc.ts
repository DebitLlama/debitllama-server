export type SupabaseQueryResult = {
  error: any;
  data: any;
  count: any;
  status: number;
  statusText: string;
};

function unwrapContext(
  ctx: { state: { supabaseClient: any; userid: string | null } },
) {
  return { client: ctx.state.supabaseClient, userid: ctx.state.userid };
}

function responseHandler(
  res: SupabaseQueryResult,
  params: { rpc: string; args: object },
) {
  if (res.error !== null) {
    console.error("QUERY ERROR!");
    console.log(res.statusText, " ", res.status);
    console.error(res.error.code);
    console.log(res.error.details);
    console.log(res.error.hint);
    console.log(res.error.message);
    console.error("RPC ", params.rpc);
    console.error("Args: ", JSON.stringify(params.args));
  }
  return { ...res };
}

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
    args: { ...args, payeeid: userid },
  });
}
