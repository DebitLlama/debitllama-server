import { PaymentIntentStatus, Pricing } from "../../../enums.ts";
import { PaginationArgs, PaginationArgsWithSearch } from "../utils.ts";
import { query } from "../utils.ts";

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

export type SelectPaymentIntentsByAccountIdPaginated = PaginationArgs & {
  accountId: number;
};

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

export async function selectFixedPricingWhereStatusIsCreated(ctx: any) {
  return await query<{}>({
    ctx,
    args: {},
    impl: async (p) => {
      return await p.client.from("PaymentIntents")
        .select("*,account_id(*),relayerBalance_id(*)")
        .eq("statusText", PaymentIntentStatus.CREATED)
        .eq("pricing", Pricing.Fixed)
        .lt("nextPaymentDate", new Date().toUTCString());
    },
    name: "selectFixedPricingWhereStatusIsCreated",
  });
}

export async function selectFixedPricingWhereStatusIsRecurring(ctx: any) {
  return await query<{}>({
    ctx,
    args: {},
    impl: async (p) => {
      return await p.client.from("PaymentIntents")
        .select("*,account_id(*),debit_item_id(*)")
        .eq("pricing", Pricing.Fixed)
        .lt("nextPaymentDate", new Date().toUTCString())
        .eq("statusText", PaymentIntentStatus.RECURRING);
    },
    name: "selectFixedPricingWhereStatusIsRecurring",
  });
}

export async function selectPaymentIntentRowByPaymentIntent(
  ctx: any,
  args: { paymentIntent: string },
) {
  return await query<{ paymentIntent: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("PaymentIntents")
        .select("*,account_id(*),debit_item_id(*)")
        .eq("paymentIntent", p.args.paymentIntent);
    },
    name: "selectPaymentIntentRowByPaymentIntent",
  });
}

export async function updateToAccountBalanceTooLow(
  ctx: any,
  args: { paymentIntentId: string },
) {
  return await query<{ paymentIntentId: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("PaymentIntents").update({
        statusText: PaymentIntentStatus.ACCOUNTBALANCETOOLOW,
      }).eq("id", p.args.paymentIntentId);
    },
    name: "updateToAccountBalanceTooLow",
  });
}

export async function updateToAccountBalanceTooLowFailedDynamic(
  ctx: any,
  args: { paymentIntentId: number; missingAmount: string },
) {
  return await query<{ paymentIntentId: number; missingAmount: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("PaymentIntents").update({
        statusText: PaymentIntentStatus.ACCOUNTBALANCETOOLOW,
        failedDynamicPaymentAmount: p.args.missingAmount,
      }).eq("id", p.args.paymentIntentId);
    },
    name: "updateToAccountBalanceTooLowFailedDynamic",
  });
}

export async function updatePaymentIntentToRelayerBalanceTooLowById(
  ctx: any,
  args: { paymentIntentId: string },
) {
  return await query<{ paymentIntentId: string }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("PaymentIntents").update({
        statusText: PaymentIntentStatus.BALANCETOOLOWTORELAY,
      }).eq("id", p.args.paymentIntentId);
    },
    name: "updateToRelayerBalanceTooLowById",
  });
}

export interface UpdateStatusAfterSuccessArgs {
  statusText: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  used_for: number;
  paymentIntentRowId: number;
}

export async function updatePaymentIntentStatusAfterSuccess(
  ctx: any,
  args: UpdateStatusAfterSuccessArgs,
) {
  return await query<UpdateStatusAfterSuccessArgs>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("PaymentIntents").update({
        statusText: p.args.statusText,
        lastPaymentDate: p.args.lastPaymentDate,
        nextPaymentDate: p.args.nextPaymentDate,
        used_for: p.args.used_for,
      }).eq("id", p.args.paymentIntentRowId);
    },
    name: "updatePaymentIntentStatusAfterSuccess",
  });
}
