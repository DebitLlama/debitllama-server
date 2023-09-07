import { Handlers } from "$fresh/server.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import { deleteDynamicPaymentRequestJobById } from "../../lib/backend/supabaseQueries.ts";
import { State } from "../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const dynamicPaymentRequestId = json.dynamicPaymentRequestId;

        // this will delete the row by id if it was created by the user and the row is not locked!
        const result = await deleteDynamicPaymentRequestJobById(
            ctx.state.supabaseClient,
            dynamicPaymentRequestId,
            ctx.state.userid
        )
        if (result.error !== null) {
            return errorResponseBuilder("Unable to delete Payment Request!")
        } else {
            return successResponseBuilder("Deleted Payment Request! The page will refresh in 10 seconds!")
        }
    }
}