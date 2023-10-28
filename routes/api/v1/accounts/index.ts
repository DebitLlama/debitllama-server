import { HandlerContext } from "$fresh/server.ts";
import {
  AccountsResponseBuilder,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  Accounts_filterKeys,
  Accounts_sortBy,
  checksAccounts_filterKeys,
  EndpointNames_ApiV1,
  Filter,
  getAccountsSortBy,
  getSortableColumns,
  validate_Accounts_filterKeys,
} from "../../../../lib/api_v1/types.ts";
import {
  getPagination,
  getTotalPages,
} from "../../../../lib/backend/businessLogic.ts";
import { selectAllAccountsAPIV1 } from "../../../../lib/backend/db/v1.ts";
import { State } from "../../../_middleware.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext<any, State>) {
    const url = new URL(_req.url);
    const current_pageQ = url.searchParams.get("current_page") || "0";
    const page_sizeQ = url.searchParams.get("page_size") || "10";
    const sort_by = url.searchParams.get("sort_by") || "created_at";
    const sort_direction = url.searchParams.get("sort_direction") || "DESC";
    const filterQ = url.searchParams.get("filter") || "{}";

    const current_page = parseInt(current_pageQ);

    if (isNaN(current_page)) {
      // Return an error! validation failed!
      const error = {
        message: "Invalid current_page parameter. Must be integer",
        status: 400,
        timestamp: new Date().toUTCString(),
      };

      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }

    const page_size = parseInt(page_sizeQ);
    if (isNaN(page_size)) {
      const error = {
        message: "Invalid page_size parameter. Must be integer",
        status: 400,
        timestamp: new Date().toUTCString(),
      };
      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }

    if (sort_direction !== "DESC" && sort_direction !== "ASC") {
      const error = {
        message: "Invalid sort_direction. Must be ASC or DESC",
        status: 400,
        timestamp: new Date().toUTCString(),
      };

      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }

    const getSortBy = getAccountsSortBy[sort_by as Accounts_sortBy];

    if (!getSortBy) {
      const error = {
        message: "Invalid SortBy parameter! Column not found",
        status: 400,
        timestamp: new Date().toUTCString(),
      };

      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }
    let filter = {};
    try {
      filter = JSON.parse(filterQ);
    } catch (err) {
      const error = {
        message: "Malformed Filter Parameter. Must be valid json.",
        status: 400,
        timestamp: new Date().toUTCString(),
      };

      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }

    // The filter can have extra parameter, but only the valid parameters are processed
    const filterParameters = Object.entries(filter).map((a) => {
      if (checksAccounts_filterKeys[a[0] as Accounts_filterKeys]) {
        return {
          parameter: a[0],
          value: a[1],
        };
      }
    });

    // Validate the filter parameters

    try {
      for (let i = 0; i < filterParameters.length; i++) {
        const filterParam = filterParameters[i] as {
          parameter: Accounts_filterKeys;
          value: string;
        };
        validate_Accounts_filterKeys[
          filterParam.parameter as Accounts_filterKeys
        ](filterParam.value);
      }
    } catch (err) {
      const error = {
        message: err.message,
        status: 400,
        timestamp: new Date().toUTCString(),
      };

      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }

    const { from, to } = getPagination(
      current_page,
      page_size,
    );

    const accounts = await selectAllAccountsAPIV1(ctx, {
      order: sort_by,
      ascending: sort_direction === "ASC",
      rangeFrom: from,
      rangeTo: to,
      filter: filterParameters as Array<{ parameter: string; value: string }>,
    });
    const total_pages = getTotalPages(accounts.count, page_size);

    if (accounts.error) {
      const error = {
        message: accounts.error.message + ". " + accounts.error.details,
        status: 400,
        timestamp: new Date().toUTCString(),
      };

      return v1Error(
        AccountsResponseBuilder(
          {
            data: [],
            pagination: {},
            returnError: true,
            error,
            filters: [],
          },
        ),
        error.status,
      );
    }

    return v1Success(AccountsResponseBuilder({
      data: accounts.data,
      pagination: {
        current_page: current_page,
        total_pages,
        page_size,
        sort_by,
        sort_direction,
        sortable_columns: getSortableColumns[EndpointNames_ApiV1.accounts],
      },
      returnError: false,
      error: {
        message: "",
        status: 0,
        timestamp: "",
      },
      filters: filterParameters as Array<Filter>,
    }));
  },
};
