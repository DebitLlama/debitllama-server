import { FreshContext } from "$fresh/server.ts";
import {
  SingleItemResponseBuilder,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  selectSingleItemForAPIV1,
  updateItemParamsAPIV1,
} from "../../../../lib/backend/db/v1.ts";

export const handler = {
  // Get an item by slug and return its

  async GET(_req: Request, ctx: FreshContext) {
    const { slug } = ctx.params;
    if (!slug) {
      return v1Error(
        SingleItemResponseBuilder({
          error: {
            message: "Invalid slug",
            status: 405,
            timestamp: new Date().toUTCString(),
          },
          returnedError: true,
          item: undefined,
        }),
        405,
      );
    }
    // Slug is the button_id, I should rename it to item_id when serving the request!

    const { data, error } = await selectSingleItemForAPIV1(ctx, {
      button_id: slug,
    });

    if (data.length === 1) {
      //Build a DebitItem response and return it
      return v1Success(SingleItemResponseBuilder({
        error: {
          message: "",
          status: 0,
          timestamp: "",
        },
        returnedError: false,
        item: data[0],
      }));
    } else {
      return v1Error(
        SingleItemResponseBuilder({
          error: {
            message: "Unable to find item",
            status: 404,
            timestamp: new Date().toUTCString(),
          },
          returnedError: true,
          item: undefined,
        }),
        404,
      );
    }
  },
  async POST(_req: Request, ctx: FreshContext) {
    const { slug } = ctx.params;

    if (!slug) {
      return v1Error(
        SingleItemResponseBuilder({
          error: {
            message: "Invalid update,undefiend slug",
            status: 405,
            timestamp: new Date().toUTCString(),
          },
          returnedError: true,
          item: undefined,
        }),
        405,
      );
    }

    const json = await _req.json();
    //You can update the redirect
    //TODO: refactor to type and value
    const { type, value } = json;

    if (type !== "delete" && type !== "redirect") {
      return v1Error(
        SingleItemResponseBuilder({
          error: {
            message: "Invalid update, missing type",
            status: 405,
            timestamp: new Date().toUTCString(),
          },
          returnedError: true,
          item: undefined,
        }),
        405,
      );
    }


    if (type === "delete" && typeof value !== "boolean") {
      return v1Error(
        SingleItemResponseBuilder({
          error: {
            message: "Invalid value, must be boolean for disabled type",
            status: 405,
            timestamp: new Date().toUTCString(),
          },
          returnedError: true,
          item: undefined,
        }),
        405,
      );
    }

    if (type === "redirect") {
      try {
        new URL(value);
      } catch (_err) {
        return v1Error(
          SingleItemResponseBuilder({
            error: {
              message: "Invalid value, must be valid URL for redirect type",
              status: 405,
              timestamp: new Date().toUTCString(),
            },
            returnedError: true,
            item: undefined,
          }),
          405,
        );
      }
    }

    const { data, error } = await updateItemParamsAPIV1(ctx, {
      type,
      value,
      button_id: slug,
    });

    if (error || data.length === 0) {
      return v1Error(
        SingleItemResponseBuilder({
          error: {
            message: "Unable to find item",
            status: 404,
            timestamp: new Date().toUTCString(),
          },
          returnedError: true,
          item: undefined,
        }),
        404,
      );
    } else {
      return v1Success(SingleItemResponseBuilder({
        error: {
          message: "",
          status: 0,
          timestamp: "",
        },
        returnedError: false,
        item: data[0],
      }));
    }
  },
};
