import { PaginationArgs, PaginationArgsWithSearch } from "../utils.ts";
import { query, responseHandler, unwrapContext } from "../utils.ts";

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

export async function selectItemsbyUserIdForPayeePaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("Items")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("payee_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "SelectItemsbyUserIdForPayeePaginated",
    },
  );
}

export async function selectItemsbyUserIdForPayeePaginatedWithSearchName(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("Items")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("name", p.args.searchTerm)
          .eq("payee_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectItemsbyUserIdForPayeePaginatedWithSearchName",
    },
  );
}
