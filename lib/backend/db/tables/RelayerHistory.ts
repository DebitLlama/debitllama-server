import { PaginationArgs, PaginationArgsWithSearch } from "../utils.ts";
import { query } from "../utils.ts";

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

export interface InsertNewTxArgs {
  payee_user_id: string;
  paymentIntentId: number;
  submittedTransaction: string;
  allGasUsed: string;
  network: string;
  paymentAmount: string;
  paymentCurrency: string;
}

export async function insertNewTx(
  ctx: any,
  args: InsertNewTxArgs,
) {
  return await query<InsertNewTxArgs>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("RelayerHistory").insert({
        created_at: new Date().toUTCString(),
        payee_user_id: p.args.payee_user_id,
        paymentIntent_id: p.args.paymentIntentId,
        submittedTransaction: p.args.submittedTransaction,
        allGasUsed: p.args.allGasUsed,
        network: p.args.network,
        paymentAmount: p.args.paymentAmount,
        paymentCurrency: p.args.paymentCurrency,
      });
    },
    name: "insertNewTx",
  });
}
