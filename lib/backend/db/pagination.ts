import { query } from "./utils.ts";

export type PaginationArgs = {
  order: string;
  ascending: boolean;
  rangeFrom: number;
  rangeTo: number;
};

export type PaginationArgsWithSearch = PaginationArgs & { searchTerm: string };

export async function selectItemsbyUserIdForPayeePaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("Items")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("payee_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "SelectItemsbyUserIdForPayeePaginated",
    },
  );
}

export async function selectItemsbyUserIdForPayeePaginatedWithSearchName(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("Items")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("name", p.args.searchTerm)
          .eq("payee_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectItemsbyUserIdForPayeePaginatedWithSearchName",
    },
  );
}

export type SelectPaymentIntentsByAccountIdPaginated = PaginationArgs & {
  accountId: number;
};

export async function selectPaymentIntentsByAccountIdPaginated(
  ctx: any,
  args: SelectPaymentIntentsByAccountIdPaginated,
) {
  return await query<SelectPaymentIntentsByAccountIdPaginated>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,debit_item_id(*)", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("account_id", p.args.accountId)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsByAccountIdPaginated",
    },
  );
}

export type SelectPaymentIntentsByAccountIdPaginatedWithSearch =
  & PaginationArgsWithSearch
  & {
    accountId: number;
  };

export async function selectPaymentIntentsByAccountIdPaginatedWithSearch(
  ctx: any,
  args: SelectPaymentIntentsByAccountIdPaginatedWithSearch,
) {
  return await query<SelectPaymentIntentsByAccountIdPaginatedWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,debit_item_id(*)", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .like("paymentIntent", p.args.searchTerm)
          .eq("account_id", p.args.accountId)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsByAccountIdPaginatedWithSearch",
    },
  );
}

export async function selectPaymentIntentsByPayeeUserIdPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("payee_user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsByPayeeUserIdPaginated",
    },
  );
}

export async function selectPaymentIntentsByPayeeUserIdPaginatedWithSearch(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .like("paymentIntent", p.args.searchTerm)
          .eq("payee_user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsByPayeeUserIdPaginatedWithSearch",
    },
  );
}

export type SelectPaymentIntentsByDebitItemIdPaginated = PaginationArgs & {
  debit_item_id: number;
};

export async function selectPaymentIntentsByDebitItemIdPaginated(
  ctx: any,
  args: SelectPaymentIntentsByDebitItemIdPaginated,
) {
  return await query<SelectPaymentIntentsByDebitItemIdPaginated>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("debit_item_id", p.args.debit_item_id)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsByDebitItemIdPaginated",
    },
  );
}

export type SelectPaymentIntentsByDebitItemIdPaginatedWithSearch =
  & PaginationArgsWithSearch
  & {
    debit_item_id: number;
  };

export async function selectPaymentIntentsByDebitItemIdPaginatedWithSearch(
  ctx: any,
  args: SelectPaymentIntentsByDebitItemIdPaginatedWithSearch,
) {
  return await query<SelectPaymentIntentsByDebitItemIdPaginatedWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .like("paymentIntent", p.args.searchTerm)
          .eq("debit_item_id", p.args.debit_item_id)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsByDebitItemIdPaginatedWithSearch",
    },
  );
}

export async function selectPaymentIntentsAllByUserIdForCreatorPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents").select(
          "*,debit_item_id(*)",
          { count: "exact" },
        ).eq(
          "creator_user_id",
          p.userid,
        ).order(
          p.args.order,
          { ascending: p.args.ascending },
        ).range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectPaymentIntentsAllByUserIdForCreatorPaginated",
    },
  );
}

export async function selectPaymentIntentsAllByUserIdForCreatorPaginatedWithSearch(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents").select(
          "*,debit_item_id(*)",
          { count: "exact" },
        ).eq(
          "creator_user_id",
          p.userid,
        ).order(
          p.args.order,
          { ascending: p.args.ascending },
        ).range(p.args.rangeFrom, p.args.rangeTo)
          .like("paymentIntent", p.args.searchTerm);
      },
      name: "selectPaymentIntentsAllByUserIdForCreatorPaginatedWithSearch",
    },
  );
}

export async function selectRelayerHistoryByPayeeUserIdPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("payee_user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerHistoryByPayeeUserIdPaginated",
    },
  );
}

export async function selectRelayerHistoryByPayeeUserIdPaginatedWithTxSearch(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("submittedTransaction", p.args.searchTerm)
          .eq("payee_user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerHistoryByPayeeUserIdPaginatedWithTxSearch",
    },
  );
}

export type SelectRelayerHistoryByPaymentIntentIdPaginated =
  & PaginationArgs
  & { paymentIntentid: number };

export async function selectRelayerHistoryByPaymentIntentIdPaginated(
  ctx: any,
  args: SelectRelayerHistoryByPaymentIntentIdPaginated,
) {
  return await query<SelectRelayerHistoryByPaymentIntentIdPaginated>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("paymentIntent_id", p.args.paymentIntentid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerHistoryByPaymentIntentIdPaginated",
    },
  );
}

export type SelectRelayerHistorybyPaymentIntentIdPaginatedWithTxSearch =
  & PaginationArgsWithSearch
  & { paymentIntentid: number };

export async function selectRelayerHistorybyPaymentIntentIdPaginatedWithTxSearch(
  ctx: any,
  args: SelectRelayerHistorybyPaymentIntentIdPaginatedWithTxSearch,
) {
  return await query<
    SelectRelayerHistorybyPaymentIntentIdPaginatedWithTxSearch
  >(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerHistory")
          .select("*", { count: "exact" })
          .eq("paymentIntent_id", p.args.paymentIntentid)
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("submittedTransaction", p.args.searchTerm)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerHistorybyPaymentIntentIdPaginatedWithTxSearch",
    },
  );
}

export async function selectRelayerTopUpHistoryByUserIdPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerTopUpHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerTopUpHistoryByUserIdPaginated",
    },
  );
}

export async function selectRelayerTopUpHistoryByUserIdPaginatedWithTxSearch(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("RelayerTopUpHistory")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("transactionHash", p.args.searchTerm)
          .eq("user_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectRelayerTopUpHistoryByUserIdPaginatedWithTxSearch",
    },
  );
}

export async function selectApiAuthTokensByUseridPaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("ApiAuthTokens")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("creator_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectApiAuthTokensByUseridPaginated",
    },
  );
}
