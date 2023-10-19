// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";
import { getPagination, getTotalPages } from "../../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../../lib/backend/queryBuilder.ts";
import { errorResponseBuilder } from "../../../lib/backend/responseBuilders.ts";
import { RELAYERTOPUPHISTORYPAGESIZE } from "../../../lib/enums.ts";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const currentPage = json.currentPage;
        if (isNaN(currentPage)) {
            return errorResponseBuilder("Missing Current Page");
        }

        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { from, to } = getPagination(currentPage, 10)

        const { data, count } = await select.ApiAuthTokens.byUseridPaginated(
            "created_at",
            false,
            from,
            to
        )

        const totalPages = getTotalPages(count, RELAYERTOPUPHISTORYPAGESIZE);
        return new Response(JSON.stringify({
            currentPage,
            data,
            totalPages
        }), { status: 200 })
    }
}