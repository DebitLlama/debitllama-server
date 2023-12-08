import { Relayer_balances_by_networkRow } from "../../../enums.ts";
import { query } from "../utils.ts";

export async function selectAllRelayerBalancesByUserId(
  ctx: any,
  args: { user_id: string },
) {
  return await query<{ user_id: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("relayer_balances_by_network").select("*").eq(
        "user_id",
        p.args.user_id,
      );
    },
    name: "selectAllRelayerBalance",
  });
}

export async function selectRelayerBalanceByUserIdForNetwork(
  ctx: any,
  args: { network: string },
) {
  return await query<{ network: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("relayer_balances_by_network").select("*").eq(
        "user_id",
        p.userid,
      ).eq("network", p.args.network);
    },
    name: "selectRelayerBalanceByUserIdForNetwork",
  });
}

export async function bulkInitNewRelayerBalances(
  ctx: any,
  args: { user_id: string; initData: Relayer_balances_by_networkRow[] },
) {
  return await query<
    { user_id: string; initData: Relayer_balances_by_networkRow[] }
  >({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("relayer_balances_by_network").insert(
        p.args.initData,
      );
    },
    name: "bulkInitNewRelayerBalances",
  });
}
