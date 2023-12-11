// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";
import { getPagination, getTotalPages } from "../../../lib/backend/businessLogic.ts";
import { selectApiAuthTokensByUseridPaginated } from "../../../lib/backend/db/tables/ApiAuthTokens.ts";
import { errorResponseBuilder } from "../../../lib/backend/responseBuilders.ts";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const currentPage = json.currentPage;
        if (isNaN(currentPage)) {
            return errorResponseBuilder("Missing Current Page");
        }

        const { from, to } = getPagination(currentPage, 10)

        const { data, count } = await selectApiAuthTokensByUseridPaginated(ctx, {
            order: "created_at",
            ascending: false,
            rangeFrom: from,
            rangeTo: to
        }
        )

        const totalPages = getTotalPages(count, 10);
        return new Response(JSON.stringify({
            currentPage,
            data,
            totalPages
        }), { status: 200 })
    }
}