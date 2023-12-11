import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import { updateToAccountBalanceTooLowFailedDynamic } from "../../../lib/backend/db/tables/PaymentIntents.ts";
import { checkRelayerAuth } from "../../../lib/relayer/utils.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const relayer_auth = _req.headers.get("X-Relayer");
    if (relayer_auth === null) {
      return v1Error(
        "Missing Relayer Authentication header",
        401,
      );
    }

    if (checkRelayerAuth(relayer_auth)) {
      const json = await _req.json();
      const { paymentIntentId, missingAmount } = json;

      const res = await updateToAccountBalanceTooLowFailedDynamic(ctx, {
        paymentIntentId,
        missingAmount,
      });

      return new Response(JSON.stringify(res), { status: 200 });
    } else {
      return v1Error(
        "Invalid Relayer Authentication header",
        401,
      );
    }
  },
};
