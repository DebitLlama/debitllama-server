import { query } from "../utils.ts";

export async function updateAccountBalanceByCommitment(
  ctx: any,
  args: { newAccountBalance: string; commitment: string },
) {
  return await query<{ newAccountBalance: string; commitment: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("Accounts").update({
        balance: p.args.newAccountBalance,
        last_modified: new Date().toUTCString(),
      }).eq("commitment", p.args.commitment);
    },
    name: "updateAccountByCommitment",
  });
}
