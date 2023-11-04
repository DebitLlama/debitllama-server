// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";
import { getPagination, getTotalPages } from "../../../lib/backend/businessLogic.ts";
import { selectRelayerTopUpHistoryByUserIdPaginated, selectRelayerTopUpHistoryByUserIdPaginatedWithTxSearch } from "../../../lib/backend/db/tables/RelayerTopUpHistory.ts";
import { errorResponseBuilder } from "../../../lib/backend/responseBuilders.ts";
import { RelayerTopupHistoryColNames, MapRelayerTopupHistoryColnamesToDbColNames, RELAYERTOPUPHISTORYPAGESIZE } from "../../../lib/enums.ts";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const currentPage = json.currentPage;
        const searchTerm = json.searchTerm;
        const sortBy = json.sortBy; // The name of the field
        const sortDirection = json.sortDirection;// ASC or DESC
        if (isNaN(currentPage)) {
            return errorResponseBuilder("Missing Current Page");
        }
        if (!sortBy) {
            return errorResponseBuilder("Missing Sort By")
        }

        if (sortDirection !== "ASC" && sortDirection !== "DESC") {
            return errorResponseBuilder("Invalid SortDirection!")
        }


        const order = MapRelayerTopupHistoryColnamesToDbColNames[sortBy as RelayerTopupHistoryColNames];
        if (!order) {
            return errorResponseBuilder("Invalid column name!")
        }
        const { from, to } = getPagination(currentPage, RELAYERTOPUPHISTORYPAGESIZE)

        let data = [];
        let rowCount = 0;
        if (searchTerm === "") {
            const { data: rows, count } = await selectRelayerTopUpHistoryByUserIdPaginated(ctx, {
                order,
                ascending: sortDirection === "ASC",
                rangeFrom: from,
                rangeTo: to
            }
            )
            data = rows;
            rowCount = count;
        } else {
            const { data: rows, count } = await selectRelayerTopUpHistoryByUserIdPaginatedWithTxSearch(ctx, {
                order,
                ascending: sortDirection === "ASC",
                rangeFrom: from,
                rangeTo: to,
                searchTerm
            }
            );
            data = rows;
            rowCount = count;
        }

        const totalPages = getTotalPages(rowCount, RELAYERTOPUPHISTORYPAGESIZE);
        return new Response(JSON.stringify({
            currentPage,
            data,
            totalPages
        }), { status: 200 })
    }
}