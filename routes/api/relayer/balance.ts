import { HandlerContext } from "$fresh/server.ts";
import { updateToAccountBalanceTooLowFailedDynamic } from "../../../lib/backend/db/tables/PaymentIntents.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const json = await _req.json();
    const { paymentIntentId, missingAmount } = json;

    const res = await updateToAccountBalanceTooLowFailedDynamic(ctx, {
      paymentIntentId,
      missingAmount,
    });

    return new Response(JSON.stringify(res), { status: 200 });
  },
};
