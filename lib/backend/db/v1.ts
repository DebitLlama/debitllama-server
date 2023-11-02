// The API V1 Queries are here

import {
  mapHookTypeToDbColName,
  Pricing_ApiV1,
  Role,
  ZapierHookTypes,
} from "../../api_v1/types.ts";
import { PaymentIntentStatus } from "../../enums.ts";
import { PaginationArgs } from "./pagination.ts";
import { query } from "./utils.ts";

export type Filter = Array<{ parameter: string; value: string }>;

export type PaginationWithFilter = PaginationArgs & {
  filter: Filter;
};

export async function selectAllItemsForAPIV1(
  ctx: any,
  args: PaginationWithFilter,
) {
  return await query<PaginationWithFilter>({
    ctx,
    args,
    impl: async (p) => {
      const q = p.client.from("Items")
        .select("*", { count: "exact" })
        .order(p.args.order, { ascending: p.args.ascending })
        .range(p.args.rangeFrom, p.args.rangeTo)
        .eq("payee_id", p.userid);
      for (let i = 0; i < p.args.filter.length; i++) {
        q.eq(p.args.filter[i].parameter, p.args.filter[i].value);
      }
      return await q;
    },
    name: "SelectAllItemsForAPIV1",
  });
}

export type SelectAccountsByCommitmentAPiV1 = {
  commitment: string;
};

export async function selectAccountsByCommitmentAPiV1(
  ctx: any,
  args: SelectAccountsByCommitmentAPiV1,
) {
  return await query<SelectAccountsByCommitmentAPiV1>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("Accounts").select().eq(
        "commitment",
        p.args.commitment,
      ).eq("user_id", p.userid);
    },
    name: "selectAccountsByCommitmentAPiV1",
  });
}

export async function selectAllAccountsAPIV1(
  ctx: any,
  args: PaginationWithFilter,
) {
  return await query<PaginationWithFilter>({
    ctx,
    args,
    impl: async (p) => {
      const query = p.client
        .from("Accounts")
        .select("*", { count: "exact" })
        .order(p.args.order, { ascending: p.args.ascending })
        .range(p.args.rangeFrom, p.args.rangeTo)
        .eq("user_id", p.userid);

      for (let i = 0; i < p.args.filter.length; i++) {
        const param = p.args.filter[i].parameter === "account_type"
          ? "accountType"
          : p.args.filter[i].parameter;

        query.eq(param, p.args.filter[i].value);
      }

      return await query;
    },
    name: "selectAllAccountsAPIV1",
  });
}

export type SelectPaymentIntentsForAccountbyAccountBalanceTooLowAPIV1 = {
  account_id: string;
};

export async function selectPaymentIntentsForAccountbyAccountBalanceTooLowAPIV1(
  ctx: any,
  args: SelectPaymentIntentsForAccountbyAccountBalanceTooLowAPIV1,
) {
  return await query<SelectPaymentIntentsForAccountbyAccountBalanceTooLowAPIV1>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("PaymentIntents")
          .select("*,debit_item_id(*)")
          .eq("account_id", p.args.account_id)
          .eq("statusText", PaymentIntentStatus.ACCOUNTBALANCETOOLOW);
      },
      name: "selectPaymentIntentsForAccountbyAccountBalanceTooLowAPIV1",
    },
  );
}

export type SelectAllPaymentIntentsByCreatorIdApiV1FilterCommitment =
  & PaginationWithFilter
  & { commitment: string };

export async function selectAllPaymentIntentsByCreatorIdApiV1FilterCommitment(
  ctx: any,
  args: SelectAllPaymentIntentsByCreatorIdApiV1FilterCommitment,
) {
  return await query<SelectAllPaymentIntentsByCreatorIdApiV1FilterCommitment>({
    ctx,
    args,
    impl: async (p) => {
      const q = p.client
        .from("PaymentIntents")
        .select("*,debit_item_id(*)", { count: "exact" })
        .eq("commitment", p.args.commitment)
        .order(p.args.order, { ascending: p.args.ascending })
        .range(p.args.rangeFrom, p.args.rangeTo);
      for (let i = 0; i < p.args.filter.length; i++) {
        q.eq(p.args.filter[i].parameter, p.args.filter[i].value);
      }
      return await q;
    },
    name: "selectAllPaymentIntentsByCreatorIdApiV1FilterCommitment",
  });
}

//NOT USED?
export async function selectAllPaymentIntentsAllByCreatorIdApiV1(
  ctx: any,
  args: PaginationWithFilter,
) {
  return await query<PaginationWithFilter>({
    ctx,
    args,
    impl: async (p) => {
      const q = p.client
        .from("PaymentIntents")
        .select("*,debit_item_id(*),account_id(*)", { count: "exact" })
        .eq("creator_user_id", p.userid)
        .order(p.args.order, { ascending: p.args.ascending })
        .range(p.args.rangeFrom, p.args.rangeTo);
      for (let i = 0; i < p.args.filter.length; i++) {
        q.eq(p.args.filter[i].parameter, p.args.filter[i].value);
      }
      return await q;
    },
    name: "selectAllPaymentIntentsAllByCreatorIdApiV1",
  });
}

export async function selectAllPaymentIntentsAPIV1(
  ctx: any,
  args: PaginationWithFilter,
) {
  return await query<PaginationWithFilter>({
    ctx,
    args,
    impl: async (p) => {
      const q = p.client
        .from("PaymentIntents")
        .select("*,debit_item_id(*),account_id(*)", { count: "exact" })
        .order(p.args.order, { ascending: p.args.ascending })
        .range(p.args.rangeFrom, p.args.rangeTo);
      for (let i = 0; i < p.args.filter.length; i++) {
        q.eq(p.args.filter[i].parameter, p.args.filter[i].value);
      }

      return await q;
    },
    name: "selectAllPaymentIntentsAPIV1",
  });
}

export type SelectPaymentIntentByPaymentIntentAPIV1 = {
  paymentIntent: string;
  role: Role;
};

export async function selectPaymentIntentByPaymentIntentAPIV1(
  ctx: any,
  args: SelectPaymentIntentByPaymentIntentAPIV1,
) {
  return await query<SelectPaymentIntentByPaymentIntentAPIV1>({
    ctx,
    args,
    impl: async (p) => {
      const q = p.client.from("PaymentIntents")
        .select("*,debit_item_id(*),account_id(*)", { count: "exact" })
        .eq("paymentIntent", p.args.paymentIntent);

      if (args.role === Role.CUSTOMER) {
        q.eq("creator_user_id", p.userid);
      } else {
        q.eq("payee_user_id", p.userid);
      }
      return await q;
    },
    name: "selectPaymentIntentByPaymentIntentAPIV1",
  });
}

// RPC CALLS

export type UpsertZapierWebhookArgs = {
  hookType: ZapierHookTypes;
  hookUrl: string;
};

export async function upsertZapierWebhook(
  ctx: any,
  args: UpsertZapierWebhookArgs,
) {
  return await query<UpsertZapierWebhookArgs>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.rpc("upsert_zapier_webhook", {
        hooktype_col: mapHookTypeToDbColName[p.args.hookType],
        hookurl: p.args.hookUrl,
        userid: p.userid,
      });
    },
    name: "upsertZapierWebhook",
  });
}

export type DeleteZapierWebhookArgs = {
  hookType: ZapierHookTypes;
};

export async function deleteZapierWebhook(
  ctx: any,
  args: DeleteZapierWebhookArgs,
) {
  return await query<DeleteZapierWebhookArgs>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.rpc("delete_zapier_webhook", {
        hooktype_col: mapHookTypeToDbColName[p.args.hookType],
        userid: p.userid,
      });
    },
    name: "deleteZapierWebhook",
  });
}

export async function getLatestSubscriptionsCreatedForPayee(
  ctx: any,
  args: {
    statusText: PaymentIntentStatus;
  },
) {
  return await query<{
    statusText: PaymentIntentStatus;
  }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("PaymentIntents")
        .select("*,debit_item_id(*),account_id(*)")
        .eq("statusText", p.args.statusText)
        .eq("payee_user_id", p.userid)
        .order("created_at", { ascending: false });
    },
    name: "getLatestSubscriptionsCreatedForPayee",
  });
}

export async function getLatestSubscriptionWithFailureForPayee(ctx: any) {
  return await query<{}>({
    ctx,
    args: {},
    impl: async (p) => {
      return await p.client.from("PaymentIntents")
        .select("*,debit_item_id(*),account_id(*)")
        //TODO: This is probably not good
        .neq("statusText", PaymentIntentStatus.CANCELLED)
        .neq("statusText", PaymentIntentStatus.CREATED)
        .neq("statusText", PaymentIntentStatus.PAID)
        .neq("statusText", PaymentIntentStatus.RECURRING)
        .eq("payee_user_id", p.userid)
        .order("created_at", { ascending: false });
    },
    name: "getLatestSubscriptionWithFailureForPayee",
  });
}

export async function getLatestSubscriptionWhereAccountBalanceLowAndFailedDynamicPayment(
  ctx: any,
) {
  return await query<{}>({
    ctx,
    args: {},
    impl: async (p) => {
      // List the Payment intents where the status is account balance too low
      // for the payee_user_id, where the pricing is dynamic
      return await p.client.from("PaymentIntents")
        .select("*,debit_item_id(*),account_id(*)")
        .neq("statusText", PaymentIntentStatus.ACCOUNTBALANCETOOLOW)
        .eq("payee_user_id", p.userid)
        .eq("pricing", Pricing_ApiV1.Dynamic);
    },
    name: "getLatestSubscriptionWhereAccountBalanceLowAndFailedDynamicPaymentAmount",
  });
}

export async function getLatestSubscriptionWhereDynamicPaymentRequestCreated(
  ctx: any,
) {
  return await query<{}>({
    ctx,
    args: {},
    impl: async (p) => {
      return await p.client.from("DynamicPaymentRequestJobs")
        .select("*,paymentIntent_id(*)")
        .eq("request_creator_id", p.userid)
        .eq("status", "Created")
        .order("last_modified", { ascending: false });
    },
    name: "getLatestSubscriptionWhereDynamicPaymentRequestCreated",
  });
}
