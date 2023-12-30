import { FreshContext } from "$fresh/server.ts";
import {
  ItemsResponseBuilder,
  newItemCreatedResponseBuilder,
  parseFilter,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import {
  EndpointNames_ApiV1,
  getItemsSortBy,
  getSortableColumns,
  Items_sortBy,
} from "../../../../lib/api_v1/types.ts";
import {
  getPagination,
  getTotalPages,
  parseCurrencyForValidation_APIV1,
} from "../../../../lib/backend/businessLogic.ts";
import {
  insertNewItemForAPIV1,
  selectAllItemsForAPIV1,
} from "../../../../lib/backend/db/v1.ts";
import { validateAddress } from "../../../../lib/backend/web3.ts";
import { Pricing } from "../../../../lib/enums.ts";
import {
  ChainIds,
  networkNameFromId,
  rpcUrl,
} from "../../../../lib/shared/web3.ts";
import { State } from "../../../_middleware.ts";

export const handler = {
  async GET(_req: Request, ctx: FreshContext<any, State>) {
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

      const items = await selectAllItemsForAPIV1(ctx, {
        order: sort_by,
        ascending: sort_direction === "ASC",
        rangeFrom: from,
        rangeTo: to,
        filter: filterParameters as Array<{ parameter: string; value: string }>,
      });

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
  async POST(_req: Request, _ctx: FreshContext<any, State>) {
    try {
      const json = await _req.json();

      const {
        name,
        chainId,
        walletaddress,
        currency,
        pricing,
        maxAmount,
        debitTimes,
        debitInterval,
        redirectto,
      } = json;

      //URL validation, this throws if its invalid url
      new URL(redirectto);

      //Verify if the network is valid

      if (rpcUrl[chainId as ChainIds] === undefined) {
        throw new Error("Invalid network");
      }

      const validAddress = validateAddress(walletaddress);

      if (!validAddress) {
        throw new Error("Invalid wallet address");
      }

      if (isNaN(parseInt(debitTimes))) {
        throw new Error("Invalid Debit Time");
      }

      if (pricing !== Pricing.Fixed && pricing !== Pricing.Dynamic) {
        throw new Error("Invalid Pricing! Fixed or Dynamic only!");
      }

      if (pricing === Pricing.Fixed && Number(debitInterval) < 1) {
        throw new Error(
          "Invalid Debit Interval! Fixed priced payments can't have unspecified/zero interval!",
        );
      }

      if (isNaN(parseFloat(maxAmount))) {
        throw new Error("Invalid Max Amount");
      }
      if (isNaN(parseInt(debitInterval))) {
        throw new Error("Invalid Max Amount");
      }
      if (pricing !== Pricing.Fixed && pricing !== Pricing.Dynamic) {
        throw new Error("Invalid pricing");
      }

      parseCurrencyForValidation_APIV1(
        currency,
        networkNameFromId[chainId as ChainIds],
        maxAmount,
      );

      const { data, error } = await insertNewItemForAPIV1(_ctx, {
        payee_id: _ctx.state.userid,
        payee_address: walletaddress,
        currency,
        max_price: maxAmount,
        debit_times: debitTimes,
        debit_interval: debitInterval,
        redirect_url: redirectto,
        pricing,
        network: chainId,
        name,
      });
      if (error) {
        console.error(error);
      }

      const button_id = data[0].button_id;

      return v1Success(newItemCreatedResponseBuilder({
        button_id,
        returnError: false,
        error: {
          message: "",
          status: 0,
          timestamp: new Date().toUTCString(),
        },
      }));
    } catch (err) {
      return v1Error(
        newItemCreatedResponseBuilder({
          returnError: true,
          error: {
            message: err.message,
            status: 400,
            timestamp: new Date().toUTCString(),
          },
          button_id: "",
        }),
        400,
      );
    }
  },
};
