import { Handlers } from "$fresh/server.ts";
import { cancelDynamicPaymentRequestLogic } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";

import { State } from "../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const dynamicPaymentRequestId = json.dynamicPaymentRequestId;
        const queryBuilder = new QueryBuilder(ctx);

        try {
            const message = await cancelDynamicPaymentRequestLogic(dynamicPaymentRequestId, queryBuilder);
            return successResponseBuilder(message);
        } catch (err: any) {
            return errorResponseBuilder(err.message);
        }
    }
}