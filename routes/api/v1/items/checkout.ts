import { HandlerContext } from "$fresh/server.ts";
import {
  CheckoutItemResponseBuilder,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import { selectSingleCheckoutItemForAPIV1 } from "../../../../lib/backend/db/v1.ts";

export const handler = {
  async GET(_req: Request, _ctx: HandlerContext) {
    const url = new URL(_req.url);

    const checkoutId = url.searchParams.get("id") || null;
    try {
      // check the checkout id item  from the database

      if (!checkoutId) {
        throw new Error("id is missing from query parameter");
      }

      //then I just return the details via the API
      const item = await selectSingleCheckoutItemForAPIV1(
        _ctx,
        { button_id: checkoutId },
      );

      if (!item.data || item.data.length === 0) {
        throw new Error(`No item found for button_id: ${checkoutId}`);
      }


      if (item.error) {
        throw new Error("Unable to find checkout item");
      }

      if (item.data[0].deleted) {
        throw new Error("The checkout item was deleted");
      }

      return v1Success(
        CheckoutItemResponseBuilder({
          returnError: false,
          error: {
            message: "",
            status: 0,
            timestamp: "",
          },
          item: item.data[0],
        }),
      );
    } catch (err: any) {
      return v1Error(
        CheckoutItemResponseBuilder({
          returnError: true,
          error: {
            message: err.message,
            status: 400,
            timestamp: new Date().toUTCString(),
          },
          item: {} as any,
        }),
        400,
      );
    }
  },
};
