export type SupabaseQueryResult = {
  error: any;
  data: any;
  count: any;
  status: number;
  statusText: string;
};



export type QueryCtx = {
  state: { supabaseClient: any; userid: string | null };
};

export type ImplArgs<T> = {
  client: any;
  userid: string | null;
  args: T;
};

export type Impl<T> = (args: ImplArgs<T>) => Promise<SupabaseQueryResult>;

export type Query<T> = {
  ctx: QueryCtx;
  args: T;
  impl: Impl<T>;
  name: string;
};

export async function query<T>(
  { ctx, args, impl, name }: Query<T>,
) {
  const { client, userid } = unwrapContext(ctx);

  const res = await impl({ client, userid, args });

  return responseHandler(res, {
    rpc: name,
    args: { ...args, userid },
  });
}



export function unwrapContext(
  ctx: QueryCtx,
) {
  return { client: ctx.state.supabaseClient, userid: ctx.state.userid };
}





export function responseHandler(
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
