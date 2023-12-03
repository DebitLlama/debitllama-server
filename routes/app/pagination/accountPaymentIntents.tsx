// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";
import { getPagination, getTotalPages } from "../../../lib/backend/businessLogic.ts";
import { selectPaymentIntentsByAccountIdPaginated, selectPaymentIntentsByAccountIdPaginatedWithSearch } from "../../../lib/backend/db/tables/PaymentIntents.ts";
import { errorResponseBuilder } from "../../../lib/backend/responseBuilders.ts";
import { MapPaymentIntentsTableColNamesToDbColNames, PAYMENTINTENTSPAGESIZE, PaymentIntentsTableColNames } from "../../../lib/enums.ts";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const accountId = json.accountId;
        const currentPage = json.currentPage;
        const searchTerm = json.searchTerm;
        const sortBy = json.sortBy; // The name of the field
        const sortDirection = json.sortDirection;// ASC or DESC

        if (!accountId) {
            return errorResponseBuilder("Missing Account Id");
        }
        if (isNaN(currentPage)) {
            return errorResponseBuilder("Missing Current Page");
        }
        if (!sortBy) {
            return errorResponseBuilder("Missing Sort By")
        }

        if (sortDirection !== "ASC" && sortDirection !== "DESC") {
            return errorResponseBuilder("Invalid SortDirection!")
        }
        const order = MapPaymentIntentsTableColNamesToDbColNames[sortBy as PaymentIntentsTableColNames];
        if (!order) {
            return errorResponseBuilder("Invalid column name!")
        }

        const { from, to } = getPagination(currentPage, PAYMENTINTENTSPAGESIZE)

        let paymentIntentsRows = [];
        let rowCount = 0;

        if (searchTerm === "") {
            const { data: piRows, count } = await selectPaymentIntentsByAccountIdPaginated(ctx, {
                accountId,
                order,
                ascending: sortDirection === "ASC",
                rangeFrom: from,
                rangeTo: to
            }
            );
            paymentIntentsRows = piRows;
            rowCount = count;
        } else {
            const { data: piRows, count } = await selectPaymentIntentsByAccountIdPaginatedWithSearch(ctx, {
                accountId,
                order,
                ascending: sortDirection === "ASC",
                rangeFrom: from,
                rangeTo: to,
                searchTerm
            }
            );
            paymentIntentsRows = piRows;
            rowCount = count;
        }

        const totalPages = getTotalPages(rowCount, PAYMENTINTENTSPAGESIZE);
        return new Response(JSON.stringify({
            currentPage,
            paymentIntentsRows,
            totalPages

        }), { status: 200 })
    }
}



