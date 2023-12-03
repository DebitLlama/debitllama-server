import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import {
  updatePaymentIntentToRelayerBalanceTooLowById,
  updateToAccountBalanceTooLow,
} from "../../../lib/backend/db/tables/PaymentIntents.ts";
import { updateMissingRelayerBalanceByChainId } from "../../../lib/backend/db/tables/RelayerBalance.ts";
import { EventType } from "../../../lib/backend/email/types.ts";
import { enqueueWebhookWork } from "../../../lib/backend/queue/kv.ts";
import { PaymentIntentStatus } from "../../../lib/enums.ts";
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
      const reason:
        | PaymentIntentStatus.ACCOUNTBALANCETOOLOW
        | PaymentIntentStatus.BALANCETOOLOWTORELAY
        | undefined = json.reason;

      if (!reason) {
        return v1Error("Invalid reason", 400);
      }

      if (reason === PaymentIntentStatus.ACCOUNTBALANCETOOLOW) {
        const paymentIntentId = json.paymentIntentId;
        const paymentIntent = json.paymentIntent;
        await updateToAccountBalanceTooLow(ctx, { paymentIntentId });
        enqueueWebhookWork({
          eventType: EventType.PaymentFailure,
          paymentIntent,
        });

        return new Response(null, { status: 200 });
      } else if (reason === PaymentIntentStatus.BALANCETOOLOWTORELAY) {
        const {
          chainId,
          paymentIntentId,
          newMissingBalance,
          relayerBalanceId,
          paymentIntent,
        } = json;

        await updatePaymentIntentToRelayerBalanceTooLowById(ctx, {
          paymentIntentId,
        }).then(async () => {
          await updateMissingRelayerBalanceByChainId(ctx, chainId, {
            newMissingBalance,
            relayerBalanceId,
          });
          enqueueWebhookWork({
            eventType: EventType.PaymentFailure,
            paymentIntent,
          });
        });
        return new Response(null, { status: 200 });
      } else {
        return new Response(null, { status: 400 });
      }
    } else {
      return v1Error(
        "Invalid Relayer Authentication header",
        401,
      );
    }
  },
};
