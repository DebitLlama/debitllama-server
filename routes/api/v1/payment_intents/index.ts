import { HandlerContext } from "$fresh/server.ts";
import {
  parseFilter,
  PaymentIntentsReponseBuilder,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  checksPaymentIntents_filterKeys,
  EndpointNames_ApiV1,
  Filter,
  getPaymentIntentsSortBy,
  getSortableColumns,
  mapPaymentIntentSortByKeysToDBColNames,
  PaymentIntents_filterKeys,
  PaymentIntents_sortyBy,
} from "../../../../lib/api_v1/types.ts";
import {
  getPagination,
  getTotalPages,
} from "../../../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../../../lib/backend/queryBuilder.ts";
import { State } from "../../../_middleware.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext<any, State>) {
    //Return all payment intents paginated!
    const url = new URL(_req.url);

    const current_pageQ = url.searchParams.get("current_page") || "0";
    const page_sizeQ = url.searchParams.get("page_size") || "10";
    const sort_by = url.searchParams.get("sort_by") || "created_at";
    const sort_direction = url.searchParams.get("sort_direction") || "DESC";
    const filterQ = url.searchParams.get("filter") || "{}";

    try {
      const current_page = parseInt(current_pageQ);
      if (isNaN(current_page)) {
        // Return an error! validation failed!
        throw new Error("Invalid current_page parameter. Must be integer");
      }
      const page_size = parseInt(page_sizeQ);
      if (isNaN(page_size)) {
        throw new Error("Invalid page_size parameter. Must be integer");
      }
      if (sort_direction !== "DESC" && sort_direction !== "ASC") {
        throw new Error("Invalid sort_direction. Must be ASC or DESC");
      }
      const getSortBy =
        getPaymentIntentsSortBy[sort_by as PaymentIntents_sortyBy];
      if (!getSortBy) {
        throw new Error("Invalid SortBy parameter! Column not found");
      }

      const filter = parseFilter(filterQ);
      const appliedFilters: Filter[] = [];
      const filterParameters = Object.entries(filter).map((a) => {
        if (
          checksPaymentIntents_filterKeys[a[0] as PaymentIntents_filterKeys]
        ) {
          // I push the unmapped filtes int an extarnal array
          appliedFilters.push({
            parameter: a[0],
            value: a[1] as string,
          });

          //I need to map the filter keys parameters to database column compatible names!!
          // Using a mapping I made for sortBy, which is compatible with filterKeys, just contains more things
          return {
            parameter: mapPaymentIntentSortByKeysToDBColNames[
              a[0] as PaymentIntents_sortyBy
            ],
            value: a[1],
          };
        }
      });

      const { from, to } = getPagination(
        current_page,
        page_size,
      );

      const queryBuilder = new QueryBuilder(ctx);
      const select = queryBuilder.select();
      const allPaymentIntents = await select.PaymentIntents
        .allApiV1(
          sort_by,
          sort_direction === "ASC",
          from,
          to,
          filterParameters as Array<{ parameter: string; value: string }>,
        );
      if (allPaymentIntents.error) {
        throw new Error(
          allPaymentIntents.error.message + ". " +
            allPaymentIntents.error.details,
        );
      }

      const total_pages = getTotalPages(allPaymentIntents.count, page_size);

      return v1Success(PaymentIntentsReponseBuilder({
        returnError: false,
        error: {
          message: "",
          status: 0,
          timestamp: "",
        },
        allPaymentIntents: allPaymentIntents.data,
        pagination: {
          current_page,
          total_pages,
          page_size,
          sort_by,
          sort_direction,
          sortable_columns:
            getSortableColumns[EndpointNames_ApiV1.paymentIntents],
        },
        filters: appliedFilters,
      }));
    } catch (err: any) {
      const error = {
        message: err.message,
        status: 400,
        timestamp: new Date().toUTCString(),
      };
      return v1Error(
        PaymentIntentsReponseBuilder({
          error,
          returnError: true,
          allPaymentIntents: [],
          pagination: {},
          filters: [],
        }),
        error.status,
      );
    }
  },
};
