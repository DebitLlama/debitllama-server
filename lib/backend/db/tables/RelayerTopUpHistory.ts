import { PaginationArgs, PaginationArgsWithSearch } from "../pagination.ts";
import { query } from "../utils.ts";

export async function selectRelayerTopUpHistoryByUserIdPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerTopUpHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerTopUpHistoryByUserIdPaginated",
    },
  );
}

export async function selectRelayerTopUpHistoryByUserIdPaginatedWithTxSearch(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerTopUpHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("transactionHash", p.args.searchTerm)
          .eq("user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerTopUpHistoryByUserIdPaginatedWithTxSearch",
    },
  );
}
