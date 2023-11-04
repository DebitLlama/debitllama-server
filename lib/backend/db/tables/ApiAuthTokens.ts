// INSERT QUERIES

import { PaginationArgs } from "../pagination.ts";
import { query, responseHandler, unwrapContext } from "../utils.ts";

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


export async function selectApiAuthTokensByUseridPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("ApiAuthTokens")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("creator_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectApiAuthTokensByUseridPaginated",
    },
  );
}
