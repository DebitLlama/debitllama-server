import { HandlerContext } from "$fresh/server.ts";
import {
  mapPaymentIntentsRowToPaymentIntentsApiV1,
  v1Error,
  V1ErrorResponseBuilder,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  getZapierHookTypesStringList,
  PaymentIntent_ApiV1,
  verifyHookType,
  ZapierHookTypes,
} from "../../../../lib/api_v1/types.ts";
import {
  deleteZapierWebhook,
  getLatestSubscriptionsCreatedForPayee,
  upsertZapierWebhook,
} from "../../../../lib/backend/db/v1.ts";
import { PaymentIntentRow } from "../../../../lib/enums.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext) {
    const url = new URL(_req.url);
    const hooktype = url.searchParams.get("hooktype") || "";

    if (!verifyHookType[hooktype as ZapierHookTypes]) {
      return v1Error(
        V1ErrorResponseBuilder({
          message:
            `hookType not found! Valid types: ${getZapierHookTypesStringList()} `,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }

    let res = { data: [], error: true };

    switch (hooktype) {
      case ZapierHookTypes.SubscriptionCreated:
        res = await getLatestSubscriptionsCreatedForPayee(
          ctx,
          {},
        );
        break;
      case ZapierHookTypes.SubscriptionCancelled:
        //TODO:
        break;
      case ZapierHookTypes.SubscriptionEnded:
        break;
      case ZapierHookTypes.Payment:
        break;
      case ZapierHookTypes.PaymentFailure:
        break;
      case ZapierHookTypes.DynamicPaymentRequestRejected:
        break;
      default:
        break;
    }

    // Return the Zapier Perform List must return an array.
    const { data, error } = res;

    // I need to return an array of payment intents that were Created for the payee
    if (error !== null) {
      return v1Error(
        V1ErrorResponseBuilder({
          message: `Something went wrong!`,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }

    const api_res: Array<PaymentIntent_ApiV1> = data.map(
      (pi: PaymentIntentRow) => {
        return mapPaymentIntentsRowToPaymentIntentsApiV1(pi);
      },
    );

    return new Response(JSON.stringify(api_res), { status: 200 });
  },

  async POST(_req: Request, ctx: HandlerContext) {
    const json = await _req.json();

    if (!verifyHookType[json.hookType as ZapierHookTypes]) {
      return v1Error(
        V1ErrorResponseBuilder({
          message:
            `hookType not found! Valid types: ${getZapierHookTypesStringList()} `,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }
    let url;

    try {
      url = new URL(json.hookUrl);
    } catch (_err) {
      return v1Error(
        V1ErrorResponseBuilder({
          message: `Not a valid hookUrl!`,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }

    const { error } = await upsertZapierWebhook(ctx, {
      hookType: json.hookType,
      hookUrl: json.hookUrl,
    });

    if (error !== null) {
      return v1Error(
        V1ErrorResponseBuilder({
          message: `Unable to upsert data`,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }

    return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
  },
  async DELETE(_req: Request, _ctx: HandlerContext) {
    const json = await _req.json();

    if (!verifyHookType[json.hookType as ZapierHookTypes]) {
      return v1Error(
        V1ErrorResponseBuilder({
          message:
            `hookType not found! Valid types: ${getZapierHookTypesStringList()} `,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }

    const { error } = await deleteZapierWebhook(_ctx, {
      hookType: json.hookType,
    });

    if (error !== null) {
      return v1Error(
        V1ErrorResponseBuilder({
          message: `Unable to delete webhook`,
          status: 404,
          timestamp: new Date().toUTCString(),
        }),
        404,
      );
    }

    return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
  },
};
