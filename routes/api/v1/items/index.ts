import { HandlerContext } from "$fresh/server.ts";
import {
  ItemsResponseBuilder,
  parseFilter,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  EndpointNames_ApiV1,
  Filter,
  getItemsSortBy,
  getSortableColumns,
  Items_sortBy,
} from "../../../../lib/api_v1/types.ts";
import {
  getPagination,
  getTotalPages,
} from "../../../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../../../lib/backend/queryBuilder.ts";
import { State } from "../../../_middleware.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext<any, State>) {
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

      const getSortBy = getItemsSortBy[sort_by as Items_sortBy];
      if (!getSortBy) {
        throw new Error("Invalid SortBy parameter! Column not found");
      }

      const filter = parseFilter(filterQ);

      const filterParameters = Object.entries(filter).map((f) => {
        // Sortable fields are also filterable
        if (getItemsSortBy[f[0] as Items_sortBy]) {
          return {
            parameter: f[0],
            value: f[1],
          };
        }
      });
      const { from, to } = getPagination(
        current_page,
        page_size,
      );

      const queryBuilder = new QueryBuilder(ctx);
      const select = queryBuilder.select();
      const items = await select.Items.allForAPIV1(
        sort_by,
        sort_direction === "ASC",
        from,
        to,
        filterParameters as Array<{ parameter: string; value: string }>,
      );

      if (items.error) {
        throw new Error("Unable to find items");
      }
      const total_pages = getTotalPages(items.count, page_size);

      return v1Success(
        ItemsResponseBuilder({
          returnError: false,
          error: {
            message: "",
            status: 0,
            timestamp: "",
          },
          items: items.data,
          pagination: {
            current_page,
            total_pages,
            page_size,
            sort_by,
            sort_direction,
            sortable_columns: getSortableColumns[EndpointNames_ApiV1.items],
          },
          filters: filterParameters as Array<
            { parameter: string; value: string }
          >,
        }),
      );
    } catch (err: any) {
      return v1Error(
        ItemsResponseBuilder({
          returnError: true,
          error: {
            message: err.message,
            status: 400,
            timestamp: new Date().toUTCString(),
          },
          items: [],
          pagination: {},
          filters: [],
        }),
        400,
      );
    }
  },
  PUT(_req: Request, ctx: HandlerContext<any, State>) {
    //TODO: Create a brand new item
    return new Response(null, { status: 200 });
  },
};
