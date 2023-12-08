import { formatEther } from "../../../../ethers.min.js";
import { ChainIds } from "../../../shared/web3.ts";
import { query } from "../utils.ts";

export async function selectRelayerBalanceByUserId(
  ctx: any,
  args: { payee_id: string },
) {
  return await query<{ payee_id: string }>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerBalance").select().eq(
          "user_id",
          p.args.payee_id,
        );
      },
      name: "selectRelayerBalanceByUserId",
    },
  );
}

export async function selectAllRelayerBalances(ctx: any, args: {}) {
  return await query<{}>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("RelayerBalance").select("*");
    },
    name: "selectAllRelayerBalance",
  });
}

export async function updateMissingRelayerBalanceByChainId(
  ctx: any,
  chainId: ChainIds,
  args: { newMissingBalance: string; relayerBalanceId: string },
) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID: {
      return await query<
        { newMissingBalance: string; relayerBalanceId: string }
      >(
        {
          ctx,
          args,
          impl: async (p) => {
            return await p.client.from("RelayerBalance").update({
              Missing_BTT_Donau_Testnet_Balance: p.args.newMissingBalance,
            }).eq("id", p.args.relayerBalanceId);
          },
          name:
            `updateMissingRelayerBalanceByChainId ${ChainIds.BTT_TESTNET_ID}`,
        },
      );
    }

    case ChainIds.BTT_MAINNET_ID: {
      return await query<
        { newMissingBalance: string; relayerBalanceId: string }
      >(
        {
          ctx,
          args,
          impl: async (p) => {
            return await p.client.from("RelayerBalance").update({
              Missing_BTT_Mainnet_Balance: p.args.newMissingBalance,
            }).eq("id", p.args.relayerBalanceId);
          },
          name:
            `updateMissingRelayerBalanceByChainId ${ChainIds.BTT_MAINNET_ID}`,
        },
      );
    }
  }
}

export async function updateNewRelayerBalanceByChainId(
  ctx: any,
  chainId: ChainIds,
  args: { newBalance: string; payee_user_id: string },
) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID: {
      return await query<{ newBalance: string; payee_user_id: string }>({
        ctx,
        args,
        impl: async (p) => {
          return await p.client.from("RelayerBalance").update({
            BTT_Donau_Testnet_Balance: p.args.newBalance,
          }).eq("user_id", p.args.payee_user_id);
        },
        name: `updateNewRelayerBalanceByChainId ${ChainIds.BTT_TESTNET_ID}`,
      });
    }

    case ChainIds.BTT_MAINNET_ID: {
      return await query<{ newBalance: string; payee_user_id: string }>({
        ctx,
        args,
        impl: async (p) => {
          return await p.client.from("RelayerBalance").update({
            BTT_Mainnet_Balance: p.args.newBalance,
          }).eq("user_id", p.args.payee_user_id);
        },
        name: `updateNewRelayerBalanceByChainId ${ChainIds.BTT_MAINNET_ID}`,
      });
    }
  }
}
