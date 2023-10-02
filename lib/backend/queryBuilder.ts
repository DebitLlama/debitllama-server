import {
  AccountTypes,
  DynamicPaymentRequestJobsStatus,
  PaymentIntentRow,
  PaymentIntentStatus,
} from "../enums.ts";
import { ChainIds } from "../shared/web3.ts";
import { formatEther } from "./web3.ts";

export type SupabaseQueryResult = {
  error: any;
  data: any;
  count: any;
  status: number;
  statusText: string;
};

export default class QueryBuilder {
  client: any;
  userid: any;

  constructor(ctx: { state: { supabaseClient: any; userid: string | null } }) {
    this.client = ctx.state.supabaseClient;
    this.userid = ctx.state.userid;
  }

  select() {
    return {
      Items: {
        //selectItemByButtonId
        byButtonId: async (buttonId: string) => {
          const res = await this.client.from("Items").select(
            "*,relayerBalance_id(*)",
          ).eq(
            "button_id",
            buttonId,
          );
          return this.responseHandler(res);
        },
        byButtonIdForPayeeOnly: async (buttonId: string) => {
          const res = await this.client.from("Items").select(
            "*,relayerBalance_id(*)",
          ).eq(
            "button_id",
            buttonId,
          ).eq("payee_id", this.userid);
          return this.responseHandler(res);
        },
        //selectItemsByPayeeIdDesc
        byUserIdForPayeeDesc: async () => {
          const res = await this.client.from("Items").select().eq(
            "payee_id",
            this.userid,
          )
            .order("created_at", { ascending: false });
          return this.responseHandler(res);
        },
        byUserIdForPayeePaginated: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("Items")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .eq("payee_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byUserIdForPayeePaginatedWithSearchName: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("Items")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .textSearch("name", searchTerm)
            .eq("payee_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        allForAPIV1: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          filter: Array<{ parameter: string; value: string }>,
        ) => {
          const query = this.client.from("Items")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .range(rangeFrom, rangeTo);
          for (let i = 0; i < filter.length; i++) {
            query.eq(filter[i].parameter, filter[i].value);
          }
          const res = await query;
          return this.responseHandler(res);
        },
      },
      Accounts: {
        // selectOpenAccountsFromUserByNetworkAndCurrency
        whereOpenByNetworkAndCurrencyAndUserId: async (
          networkId: string,
          currency: string,
        ) => {
          const res = await this.client
            .from("Accounts")
            .select()
            .eq("closed", false)
            .eq("user_id", this.userid)
            .eq("network_id", networkId)
            .eq("currency", currency)
            .order("last_modified", { ascending: false });
          return this.responseHandler(res);
        },
        //selectAccountByCommitment
        byCommitment: async (commitment: string) => {
          const res = await this.client.from("Accounts").select().eq(
            "commitment",
            commitment,
          ).eq("user_id", this.userid);
          return this.responseHandler(res);
        },
        byCommitmentAPiV1: async (commitment: string) => {
          const res = await this.client.from("Accounts").select().eq(
            "commitment",
            commitment,
          );
          return this.responseHandler(res);
        },
        //selectOpenAccountsByIdDESC
        whereOpenByUserIdOrderDesc: async () => {
          const res = await this.client
            .from("Accounts")
            .select()
            .eq("user_id", this.userid)
            .eq("closed", false)
            .order("last_modified", { ascending: false });
          return this.responseHandler(res);
        },
        whereClosedByUserIdOrderDesc: async () => {
          const res = await this.client
            .from("Accounts")
            .select()
            .eq("user_id", this.userid)
            .eq("closed", true)
            .order("last_modified", { ascending: false });
          return this.responseHandler(res);
        },
        allByUserIdOrderDesc: async () => {
          const res = await this.client
            .from("Accounts")
            .select()
            .eq("user_id", this.userid)
            .order("last_modified", { ascending: false });
          return this.responseHandler(res);
        },
        allApiV1: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          filter: Array<{ parameter: string; value: string }>,
        ) => {
          const query = this.client
            .from("Accounts")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .range(rangeFrom, rangeTo);

          for (let i = 0; i < filter.length; i++) {
            const param = filter[i].parameter === "account_type"
              ? "accountType"
              : filter[i].parameter;

            query.eq(param, filter[i].value);
          }

          const res = await query;
          return this.responseHandler(res);
        },
      },
      Profiles: {
        //selectProfileByUserId
        byUserId: async () => {
          const res = await this.client.from("Profiles").select("*", {
            count: "exact",
          }).eq(
            "id",
            this.userid,
          );
          return this.responseHandler(res);
        },
      },
      //selectPaymentIntentsByUserIdDESC
      PaymentIntents: {
        byUserIdForCreatorDesc: async () => {
          const res = await this.client.from("PaymentIntents").select(
            "*,debit_item_id(*)",
          ).eq(
            "creator_user_id",
            this.userid,
          ).order(
            "created_at",
            { ascending: false },
          );
          return this.responseHandler(res);
        },
        //selectPaymentIntentsByAccountBalanceTooLow
        byAccountBalanceTooLowByUserIdForCreatorDesc: async () => {
          const res = await this.client.from("PaymentIntents").select(
            "*,debit_item_id(*)",
          ).eq(
            "creator_user_id",
            this.userid,
          ).eq("statusText", PaymentIntentStatus.ACCOUNTBALANCETOOLOW).order(
            "created_at",
            { ascending: false },
          );
          return this.responseHandler(res);
        },
        forAccountbyAccountBalanceTooLow: async (account_id: number) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,debit_item_id(*)")
            .eq("creator_user_id", this.userid)
            .eq("account_id", account_id)
            .eq("statusText", PaymentIntentStatus.ACCOUNTBALANCETOOLOW);
          return this.responseHandler(res);
        },
        //API v1 lets ya fetch without creator_user_id!
        forAccountbyAccountBalanceTooLowAPIV1: async (account_id: number) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,debit_item_id(*)")
            .eq("account_id", account_id)
            .eq("statusText", PaymentIntentStatus.ACCOUNTBALANCETOOLOW);
          return this.responseHandler(res);
        },
        //selectPaymentIntentsByRelayerBalanceTooLow
        byRelayerBalanceTooLowAndUserIdForPayee: async (network: ChainIds) => {
          const res = await this.client.from("PaymentIntents").select("*")
            .eq("payee_user_id", this.userid)
            .eq("network", network)
            .eq("statusText", PaymentIntentStatus.BALANCETOOLOWTORELAY);
          return this.responseHandler(res);
        },
        //selectPaymentIntentByPaymentIntentAndCreatorUserId
        byPaymentIntentAndUserIdForCreator: async (paymentIntent: string) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,debit_item_id(*),account_id(*)")
            .eq("paymentIntent", paymentIntent)
            .eq("creator_user_id", this.userid);
          return this.responseHandler(res);
        },
        //selectPaymentIntentByPaymentIntentAndPayeeUserId
        byPaymentIntentAndUserIdForPayee: async (paymentIntent: string) => {
          const res = await this.client.from("PaymentIntents").select(
            "*,debit_item_id(*),account_id(*)",
          ).eq(
            "paymentIntent",
            paymentIntent,
          ).eq("payee_user_id", this.userid);
          return this.responseHandler(res);
        },
        //selectPaymentIntentsByPayeeAndItem
        byItemIdAndUserIdForPayeeOrderDesc: async (debit_item_id: string) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,account_id(balance,currency)").eq(
              "payee_user_id",
              this.userid,
            ).eq(
              "debit_item_id",
              debit_item_id,
            ).order("created_at", { ascending: false });
          return this.responseHandler(res);
        },
        byAccountIdPaginated: async (
          accountId: number,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,debit_item_id(*)", { count: "exact" })
            .order(order, { ascending })
            .eq("account_id", accountId)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byAccountIdPaginatedWithSearch: async (
          accountId: number,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,debit_item_id(*)", { count: "exact" })
            .order(order, { ascending })
            .like("paymentIntent", searchTerm)
            .eq("account_id", accountId)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byPayeeUserIdPaginated: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
            .order(order, { ascending })
            .eq("payee_user_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byPayeeUserIdPaginatedWithSearch: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
            .order(order, { ascending })
            .like("paymentIntent", searchTerm)
            .eq("payee_user_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byDebitItemIdPaginated: async (
          debit_item_id: number,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
            .order(order, { ascending })
            .eq("debit_item_id", debit_item_id)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byDebitItemIdPaginatedWithSearch: async (
          debit_item_id: number,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .select("*,account_id(*),debit_item_id(*)", { count: "exact" })
            .order(order, { ascending })
            .like("paymentIntent", searchTerm)
            .eq("debit_item_id", debit_item_id)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        allByUserIdForCreatorPaginated: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("PaymentIntents").select(
            "*,debit_item_id(*)",
            { count: "exact" },
          ).eq(
            "creator_user_id",
            this.userid,
          ).order(
            order,
            { ascending },
          ).range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        allByUserIdForCreatorPaginatedWithSearch: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("PaymentIntents").select(
            "*,debit_item_id(*)",
            { count: "exact" },
          ).eq(
            "creator_user_id",
            this.userid,
          ).order(
            order,
            { ascending },
          ).range(rangeFrom, rangeTo)
            .like("paymentIntent", searchTerm);
          return this.responseHandler(res);
        },
        allByCreatorIdApiV1FilterCommitment: async (
          commitment: string,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          filter: Array<{ parameter: string; value: string }>,
        ) => {
          const query = this.client
            .from("PaymentIntents")
            .select("*,debit_item_id(*)", { count: "exact" })
            .eq("commitment", commitment)
            .order(order, { ascending })
            .range(rangeFrom, rangeTo);
          for (let i = 0; i < filter.length; i++) {
            query.eq(filter[i].parameter, filter[i].value);
          }
          const res = await query;
          return this.responseHandler(res);
        },
        allByCreatorIdApiV1: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          filter: Array<{ parameter: string; value: string }>,
        ) => {
          const query = this.client
            .from("PaymentIntents")
            .select("*,debit_item_id(*),account_id(*)", { count: "exact" })
            .eq("creator_user_id", this.userid)
            .order(order, { ascending })
            .range(rangeFrom, rangeTo);
          for (let i = 0; i < filter.length; i++) {
            query.eq(filter[i].parameter, filter[i].value);
          }
          const res = await query;
          return this.responseHandler(res);
        },
        allApiV1: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          filter: Array<{ parameter: string; value: string }>,
        ) => {
          const query = this.client
            .from("PaymentIntents")
            .select("*,debit_item_id(*),account_id(*)", { count: "exact" })
            .order(order, { ascending })
            .range(rangeFrom, rangeTo);
          for (let i = 0; i < filter.length; i++) {
            query.eq(filter[i].parameter, filter[i].value);
          }
          const res = await query;
          return this.responseHandler(res);
        },
        byPaymentIntentApiV1: async (paymentIntent: string) => {
          const query = await this.client.from("PaymentIntents")
            .select("*,debit_item_id(*),account_id(*)", { count: "exact" })
            .eq("paymentIntent", paymentIntent);
          return this.responseHandler(query);
        },
      },

      RelayerHistory: {
        //selectRelayerHistoryById
        byPaymentIntentId: async (paymentIntentId: number) => {
          const res = await this.client.from("RelayerHistory")
            .select("*")
            .eq("paymentIntent_id", paymentIntentId);
          return this.responseHandler(res);
        },
        //selectRelayerHistoryByUserId
        byUserIdForPayee: async () => {
          const res = await this.client.from("RelayerHistory")
            .select("*")
            .eq("payee_user_id", this.userid);
          return this.responseHandler(res);
        },
        byPayeeUserIdPaginated: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("RelayerHistory")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .eq("payee_user_id", this.userid)
            .range(rangeFrom, rangeTo);

          return this.responseHandler(res);
        },
        byPayeeUserIdPaginatedWithTxSearch: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("RelayerHistory")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .textSearch("submittedTransaction", searchTerm)
            .eq("payee_user_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byPaymentIntentIdPaginated: async (
          paymentIntentid: number,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("RelayerHistory")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .eq("paymentIntent_id", paymentIntentid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
        byPaymentIntentIdPaginatedWithTxSearch: async (
          paymentIntentid: number,
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("RelayerHistory")
            .select("*", { count: "exact" })
            .eq("paymentIntent_id", paymentIntentid)
            .order(order, { ascending })
            .textSearch("submittedTransaction", searchTerm)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
      },
      RelayerBalance: {
        //selectRelayerBalanceByUserId
        byUserId: async () => {
          const res = await this.client.from("RelayerBalance").select().eq(
            "user_id",
            this.userid,
          );
          return this.responseHandler(res);
        },
      },
      RelayerTopUpHistory: {
        //selectRelayerTopUpHistoryDataByTransactionHash
        byTransactionHash: async (hash: string) => {
          const res = await this.client.from("RelayerTopUpHistory")
            .select()
            .eq("transactionHash", hash);
          return this.responseHandler(res);
        },
        //selectRelayerTopUpHistoryDataByUserId
        byUserIdDesc: async () => {
          const res = await this.client.from("RelayerTopUpHistory").select()
            .eq(
              "user_id",
              this.userid,
            ).order("created_at", { ascending: false });
          return this.responseHandler(res);
        },
        byUserIdPaginated: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("RelayerTopUpHistory")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .eq("user_id", this.userid)
            .range(rangeFrom, rangeTo);

          return this.responseHandler(res);
        },
        byUserIdPaginatedWithTxSearch: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
          searchTerm: string,
        ) => {
          const res = await this.client.from("RelayerTopUpHistory")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .textSearch("transactionHash", searchTerm)
            .eq("user_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
      },
      ApiAuthTokens: {
        byUseridPaginated: async (
          order: string,
          ascending: boolean,
          rangeFrom: number,
          rangeTo: number,
        ) => {
          const res = await this.client.from("ApiAuthTokens")
            .select("*", { count: "exact" })
            .order(order, { ascending })
            .eq("creator_id", this.userid)
            .range(rangeFrom, rangeTo);
          return this.responseHandler(res);
        },
      },
      Webhooks: {
        byUserId: async () => {
          const res = await this.client.from("Webhooks")
            .select("*")
            .eq("creator_id", this.userid);
          return this.responseHandler(res);
        },
      },
      DynamicPaymentRequestJobs: {
        //selectDynamicPaymentRequestJobByPaymentIntentIdAndUserId
        byPaymentIntentIdAndUserId: async (paymentIntent_id: string) => {
          const res = await this.client.from("DynamicPaymentRequestJobs")
            .select("*,paymentIntent_id(*)")
            .eq("paymentIntent_id", paymentIntent_id)
            .eq("request_creator_id", this.userid);
          return this.responseHandler(res);
        },
        //selectDynamicPaymentRequestJobById
        byJobId: async (jobId: number) => {
          const res = await this.client.from("DynamicPaymentRequestJobs")
            .select("*,relayerBalance_id(*),paymentIntent_id(*)").eq(
              "id",
              jobId,
            );
          return this.responseHandler(res);
        },
        byPaymentIntentId: async (paymentIntent_id: string) => {
          const res = await this.client.from("DynamicPaymentRequestJobs")
            .select("*,relayerBalance_id(*),paymentIntent_id(*)")
            .eq("paymentIntent_id", paymentIntent_id);

          return this.responseHandler(res);
        },
      },
    };
  }

  insert() {
    return {
      Accounts: {
        //insertNewAccount
        newAccount: async (
          network_id: string,
          commitment: string,
          name: string,
          currency: string,
          balance: string,
          accountType: AccountTypes,
          creator_address: string,
        ) => {
          const res = await this.client.from("Accounts").insert({
            created_at: new Date().toUTCString(),
            user_id: this.userid,
            network_id,
            commitment,
            name,
            closed: false,
            currency,
            balance: formatEther(balance),
            last_modified: new Date().toUTCString(),
            accountType,
            creator_address,
          });

          return this.responseHandler(res);
        },
      },
      Items: {
        //insertNewItem
        newItem: async (
          payee_address: string,
          currency: string,
          max_price: string,
          debit_times: string,
          debit_interval: string,
          redirect_url: string,
          pricing: string,
          network: string,
          name: string,
          relayerBalance_id: string,
        ) => {
          const res = await this.client.from("Items").insert({
            created_at: new Date().toUTCString(),
            payee_id: this.userid,
            payee_address,
            currency,
            max_price,
            debit_times,
            debit_interval,
            redirect_url,
            pricing,
            network,
            name,
            relayerBalance_id,
          }).select();
          return this.responseHandler(res);
        },
      },
      Profiles: {
        //insertProfile
        newProfile: async (
          firstname: string,
          lastname: string,
          addressline1: string,
          addressline2: string,
          city: string,
          postcode: string,
          country: string,
        ) => {
          const res = await this.client.from("Profiles").insert({
            userid: this.userid,
            firstname,
            lastname,
            addressline1,
            addressline2,
            city,
            postcode,
            country,
          });
          return this.responseHandler(res);
        },
      },
      Feedback: {
        //insertFeedback
        newFeedback: async (subject: string, message: string) => {
          const res = await this.client.from("Feedback").insert(
            {
              creator_id: this.userid,
              subject,
              message,
            },
          ).select();
          return this.responseHandler(res);
        },
      },
      //insertPaymentIntent
      PaymentIntent: {
        newPaymentIntent: async (
          payee_user_id: string,
          account_id: string,
          payee_address: string,
          maxDebitAmount: string,
          debitTimes: string,
          debitInterval: string,
          paymentIntent: string,
          commitment: string,
          estimatedGas: string,
          statusText: string,
          pricing: string,
          currency: string,
          network: string,
          debit_item_id: string,
          proof: string,
          publicSignals: string,
          relayerBalance_id: number,
        ) => {
          const res = await this.client.from(
            "PaymentIntents",
          ).insert({
            created_at: new Date().toUTCString(),
            creator_user_id: this.userid,
            payee_user_id,
            account_id,
            payee_address,
            maxDebitAmount,
            debitTimes,
            debitInterval,
            paymentIntent,
            commitment,
            estimatedGas,
            statusText,
            lastPaymentDate: null,
            nextPaymentDate: new Date().toUTCString(),
            pricing,
            currency,
            network,
            debit_item_id,
            proof,
            publicSignals,
            relayerBalance_id,
          });

          return this.responseHandler(res);
        },
      },
      RelayerBalance: {
        //insertNewRelayerBalance
        newRelayerBalance: async () => {
          const res = await this.client.from("RelayerBalance").insert({
            created_at: new Date().toUTCString(),
            user_id: this.userid,
          });

          return this.responseHandler(res);
        },
      },
      RelayerTopUpHistory: {
        //insertNewRelayerTopUpHistory
        newRow: async (
          transactionHash: string,
          chainId: ChainIds,
          addedBalance: string,
        ) => {
          const res = await this.client.from("RelayerTopUpHistory")
            .insert({
              created_at: new Date().toUTCString(),
              transactionHash,
              user_id: this.userid,
              network: chainId,
              Amount: addedBalance,
            });
          return this.responseHandler(res);
        },
      },
      //insertDynamicPaymentRequestJob
      DynamicPaymentRequestJobs: {
        newJob: async (
          paymentIntent_id: number,
          requestedAmount: string,
          allocatedGas: string,
          relayerBalance_id: number,
        ) => {
          const res = await this.client.from("DynamicPaymentRequestJobs")
            .insert({
              created_at: new Date().toUTCString(),
              paymentIntent_id,
              requestedAmount,
              status: DynamicPaymentRequestJobsStatus.CREATED,
              request_creator_id: this.userid,
              allocatedGas,
              relayerBalance_id,
            }).select();
          return this.responseHandler(res);
        },
      },
      ApiAuthTokens: {
        newToken: async (
          access_token: string,
          expiryDate: string,
        ) => {
          const res = await this.client.from("ApiAuthTokens")
            .insert({
              created_at: new Date().toUTCString(),
              access_token,
              creator_id: this.userid,
              expiry_date_utc: expiryDate,
            });
          return this.responseHandler(res);
        },
      },
      Webhooks: {
        newUrl: async (
          webhook_url: string,
        ) => {
          const res = await this.client.from("Webhooks").insert({
            created_at: new Date().toUTCString(),
            webhook_url,
            creator_id: this.userid,
          });
          return this.responseHandler(res);
        },
      },
    };
  }

  update() {
    return {
      Accounts: {
        //updateAccount
        balanceAndClosedById:
          (async (balance: string, closed: boolean, id: number) => {
            const res = await this.client.from("Accounts")
              .update({
                balance: formatEther(balance),
                closed,
                last_modified: new Date().toUTCString(),
              }).eq("id", id);
            return this.responseHandler(res);
          }),
      },
      Items: {
        //updateItem
        deletedByButtonIdForPayee: async (
          deleted: boolean,
          button_id: string,
        ) => {
          const res = await this.client.from("Items")
            .update({ deleted }).eq("payee_id", this.userid).eq(
              "button_id",
              button_id,
            );
          return this.responseHandler(res);
        },
        //updateItemPaymentIntentsCount
        paymentIntentsCountByButtonId: async (
          payment_intents_count: number,
          button_id: string,
        ) => {
          const res = await this.client.from("Items").update({
            payment_intents_count,
          }).eq("button_id", button_id);

          return this.responseHandler(res);
        },
        updateRedirectUrlForItem: async (
          button_id: string,
          redirect_url: string,
        ) => {
          const res = await this.client.from("Items").update({
            redirect_url,
          }).eq("button_id", button_id)
            .eq("payee_id", this.userid);
          return this.responseHandler(res);
        },
      },
      PaymentIntents: {
        //updatePaymentItemStatus
        statusByPaymentIntent: async (
          status: PaymentIntentStatus,
          paymentIntent: string,
        ) => {
          const res = await this.client.from("PaymentIntents").update({
            statusText: status,
          }).eq("paymentIntent", paymentIntent);

          return this.responseHandler(res);
        },
        //updatePaymentIntentAccountBalanceTooLowDynamicPayment
        statusTextToAccountBalanceTooLowById: async (
          paymentIntentRow: PaymentIntentRow,
        ) => {
          const res = await this.client.from("PaymentIntents").update({
            statusText: PaymentIntentStatus.ACCOUNTBALANCETOOLOW,
          }).eq("id", paymentIntentRow.id);

          return this.responseHandler(res);
        },
        //This will set the failedDynamicPaymentAmount to zero, it's only used after account balance was added
        updateForAccountBalanceNotLowAnymore: async (
          statusText: string,
          paymentIntentRow: PaymentIntentRow,
        ) => {
          const res = await this.client.from("PaymentIntents").update({
            failedDynamicPaymentAmount: "0",
            statusText,
          }).eq("id", paymentIntentRow.id);
          return this.responseHandler(res);
        },
        toCancelledByAccountIdForCreator: async (
          accountId: number,
        ) => {
          const res = await this.client.from("PaymentIntents")
            .update({
              statusText: PaymentIntentStatus.CANCELLED,
            }).eq("creator_user_id", this.userid)
            .eq("account_id", accountId)
            .neq("statusText", PaymentIntentStatus.PAID)
            .neq("statusText", PaymentIntentStatus.CANCELLED);

          return this.responseHandler(res);
        },
      },
      RelayerBalance: {
        //updateBTT_Donau_Testnet_Balance
        BTT_Donau_Testnet_BalanceById: async (
          newRelayerBalance: bigint,
          relayerBalance_id: number,
        ) => {
          const res = await this.client.from("RelayerBalance").update({
            BTT_Donau_Testnet_Balance: formatEther(newRelayerBalance),
          }).eq("id", relayerBalance_id);

          return this.responseHandler(res);
        },
        //updateMissing_BTT_Donau_Testnet_Balance
        Missing_BTT_Donau_Testnet_BalanceById: async (
          newBalance: bigint,
          newMissingBalance: bigint,
          id: number,
        ) => {
          const res = await this.client.from("RelayerBalance").update({
            BTT_Donau_Testnet_Balance: formatEther(newBalance),
            last_topup: new Date().toUTCString(),
            Missing_BTT_Donau_Testnet_Balance: formatEther(newMissingBalance),
          }).eq("id", id);

          return this.responseHandler(res);
        },
      },
      Webhooks: {
        byUserId: async (webhook_url: string) => {
          const res = await this.client.from("Webhooks")
            .update({ webhook_url })
            .eq("creator_id", this.userid);
          return this.responseHandler(res);
        },
      },
      DynamicPaymentRequestJobs: {
        //updateDynamicPaymentRequestJob
        ByPaymentIntentIdAndRequestCreator: async (
          paymentIntent_id: number,
          requestedAmount: string,
          allocatedGas: string,
        ) => {
          const res = await this.client.from("DynamicPaymentRequestJobs")
            .update({
              created_at: new Date().toUTCString(),
              requestedAmount,
              status: DynamicPaymentRequestJobsStatus.CREATED,
              allocatedGas,
            }).eq("paymentIntent_id", paymentIntent_id)
            .eq("request_creator_id", this.userid).select();

          return this.responseHandler(res);
        },
      },
    };
  }

  upsert() {
    return {
      Profiles: {
        //upsertProfile
        all: async (
          firstname: string,
          lastname: string,
          addressline1: string,
          addressline2: string,
          city: string,
          postcode: string,
          country: string,
        ) => {
          const res = await this.client.from("Profiles").upsert(
            {
              id: this.userid,
              firstname,
              lastname,
              addressline1,
              addressline2,
              city,
              postcode,
              country,
            },
            { ignoreDuplicates: false },
          ).select();

          return this.responseHandler(res);
        },
      },
    };
  }

  delete() {
    return {
      DynamicPaymentRequestJobs: {
        // deleteDynamicPaymentRequestJobById
        byIdForRequestCreator: async (id: number) => {
          const res = await this.client.from("DynamicPaymentRequestJobs")
            .delete()
            .eq("request_creator_id", this.userid)
            .eq("id", id)
            .neq(
              "status",
              DynamicPaymentRequestJobsStatus.LOCKED,
            );
          return this.responseHandler(res);
        },
      },
      ApiAuthTokens: {
        ByAccessToken: async (accessToken: string) => {
          const res = await this.client.from("ApiAuthTokens")
            .delete()
            .eq("access_token", accessToken)
            .eq("creator_id", this.userid);
          return this.responseHandler(res);
        },
      },
    };
  }

  responseHandler(res: SupabaseQueryResult) {
    if (res.error !== null) {
      console.log("QUERY ERROR!");
      console.log(res);
      console.log(res.error);
    }
    return { ...res };
  }
}
