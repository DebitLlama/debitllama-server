import { HandlerContext } from "$fresh/server.ts";
import { v1Error } from "../../../lib/api_v1/responseBuilders.ts";
import {
  selectFixedPricingWhereStatusIsCreated,
  selectFixedPricingWhereStatusIsRecurring,
} from "../../../lib/backend/db/tables/PaymentIntents.ts";

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const json = await _req.json();
    const statusText: "CREATED" | "RECURRING" | undefined = json.statusText;

    if (statusText === "CREATED") {
      const res = await selectFixedPricingWhereStatusIsCreated(ctx);
      return new Response(JSON.stringify(res), { status: 200 });
    } else if (statusText === "RECURRING") {
      const res = await selectFixedPricingWhereStatusIsRecurring(ctx);
      return new Response(JSON.stringify(res), { status: 200 });
    } else {
      return v1Error("Invalid status text", 400);
    }
  },
};
