import { HandlerContext } from "$fresh/server.ts";
import {
  v1Error,
  V1ErrorResponseBuilder,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  getZapierHookTypesStringList,
  verifyHookType,
  ZapierHookTypes,
} from "../../../../lib/api_v1/types.ts";
import {
  deleteZapierWebhook,
  upsertZapierWebhook,
} from "../../../../lib/backend/db/v1.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    // Return the Zapier Perform List must return an array.

    // I need to return an array of payment intents that were Created for the payee

    return new Response(JSON.stringify([]), { status: 200 });
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
