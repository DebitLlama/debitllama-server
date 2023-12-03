import { query } from "../utils.ts";

export async function selectZapierWebhooksByPayeeId(
  ctx: any,
  args: { payeeId: string },
) {
  return await query<{ payeeId: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("zapier_webhooks")
        .select("*")
        .eq("user_id", p.args.payeeId);
    },
    name: "selectZapierWebhooksByPayeeId",
  });
}
