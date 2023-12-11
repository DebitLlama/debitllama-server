//This should descibe the API v1 interface for api endpoints and webhook

import { ethers } from "../../ethers.min.js";
import { AccountTypes } from "../enums.ts";
import { ChainIds, networkNameFromId } from "../shared/web3.ts";

export enum EventTypes_ApiV1 {
  customerSubscriptionCreated = "customer.subscription.created",
  customerSubscriptionCancelled = "customer.subscription.cancelled",
  customerSubscriptionPayment = "customer.subscription.payment",
  customerSubscriptionFinished = "customer.subscription.finished",
  customerSubscriptionBalanceLow = "customer.subscription.balancelow",
  customerSubscriptionBalanceUpdated = "customer.subscription.balanceupdated",
  dynamicPaymentRequestCreated = "merchant.request.created",
  dynamicPaymentRequestLocked = "merchant.request.locked",
  dynamicPaymentRequestRejected = "merchant.request.rejected",
  dynamicPaymentRequestCompleted = "merchant.request.completed",
}

export enum SubscriptionStatus_ApiV1 {
  CREATED = "Created", // A subscription was created and its ready to be relayed
  CANCELLED = "Cancelled", // A subscription was cancelled
  ACTIVE = "Active", // A subscription is active, means the payments are recurring
  COMPLETED = "Completed",
  BLOCKED = "Blocked", // Blocked subscription is delaying because of invalid account balance or relayer balance
}

export enum PaymentIntentStatus_ApiV1 {
  CREATED = "CREATED",
  CANCELLED = "CANCELLED",
  RECURRING = "RECURRING",
  PAID = "PAID",
  ACCOUNTBALANCETOOLOW = "ACCOUNTBALANCETOOLOW",
}

export enum Role {
  CUSTOMER = "customer",
  MERCHANT = "merchant",
}

export const checkRole: { [key in Role]: boolean } = {
  [Role.CUSTOMER]: true,
  [Role.MERCHANT]: true,
};

export enum ZapierHookTypes {
  SubscriptionCreated = "SubscriptionCreated",
  SubscriptionCancelled = "SubscriptionCancelled",
  SubscriptionEnded = "SubscriptionEnded",
  Payment = "Payment",
  PaymentFailure = "PaymentFailure",
  DynamicPaymentRequestRejected = "DynamicPaymentRequestRejected",
}

export const getZapierHookTypesStringList = () => {
  let buff = "";
  for (const ht in ZapierHookTypes) {
    buff += "," + ht;
  }
  // Remove the first extra comma
  return buff.slice(1);
};

export const verifyHookType: {
  [key in ZapierHookTypes]: boolean;
} = {
  [ZapierHookTypes.SubscriptionCreated]: true,
  [ZapierHookTypes.SubscriptionCancelled]: true,
  [ZapierHookTypes.SubscriptionEnded]: true,
  [ZapierHookTypes.Payment]: true,
  [ZapierHookTypes.PaymentFailure]: true,
  [ZapierHookTypes.DynamicPaymentRequestRejected]: true,
};

export const mapHookTypeToDbColName: {
  [key in ZapierHookTypes]: string;
} = {
  [ZapierHookTypes.SubscriptionCreated]: "subscription_created_url",
  [ZapierHookTypes.SubscriptionCancelled]: "subscription_cancelled_url",
  [ZapierHookTypes.SubscriptionEnded]: "subscription_ended_url",
  [ZapierHookTypes.Payment]: "payment_url",
  [ZapierHookTypes.PaymentFailure]: "payment_failure_url",
  [ZapierHookTypes.DynamicPaymentRequestRejected]:
    "dynamic_payment_request_rejected_url",
};

export const validatePaymentIntentStatus_ApiV1: {
  [key in PaymentIntentStatus_ApiV1]: boolean;
} = {
  [PaymentIntentStatus_ApiV1.CREATED]: true,
  [PaymentIntentStatus_ApiV1.CANCELLED]: true,
  [PaymentIntentStatus_ApiV1.RECURRING]: true,
  [PaymentIntentStatus_ApiV1.PAID]: true,
  [PaymentIntentStatus_ApiV1.ACCOUNTBALANCETOOLOW]: true,
};

export enum Pricing_ApiV1 {
  Fixed = "Fixed",
  Dynamic = "Dynamic",
}

export interface Network_ApiV1 {
  name: string;
  rpc: string;
  chain_id: string;
  currency: string;
  virtual_accounts_contract: string;
  connected_wallets_contract: string;
  available_currencies: Array<Currency_ApiV1>;
}

export interface DebitItem_ApiV1 {
  id: number;
  created_at: string;
  payee_address: string;
  currency: Currency_ApiV1;
  max_price: string;
  debit_times: number;
  debit_interval: number;
  button_id: string; // Rename to item_id
  redirect_url: string;
  pricing: Pricing_ApiV1;
  network: Network_ApiV1;
  name: string;
  deleted: boolean;
  payment_intents_count: number;
}

export interface PaymentIntent_ApiV1 {
  id: number;
  created_at: string;
  account: Account_ApiV1;
  payee_address: string;
  max_debit_amount: string;
  debit_times: number;
  debit_interval: number;
  payment_intent: string;
  commitment: string;
  estimated_gas: string;
  status_text: PaymentIntentStatus_ApiV1;
  last_payment_date: string | null; // UTC strinng
  next_payment_date: string | null; // UTC string
  pricing: Pricing_ApiV1;
  currency: Currency_ApiV1;
  network: Network_ApiV1;
  debit_item: DebitItem_ApiV1;
  used_for: number; // how many times it was used already
  transactions_left: number; // calulated like: debit_interval - used_for
  failed_dynamic_payment_amount: string; //If dynamic payment was requested but it failed because account balance too low!
}

export enum AccountTypes_ApiV1 {
  VIRTUALACCOUNT = "VIRTUALACCOUNT",
  CONNECTEDWALLET = "CONNECTEDWALLET",
}

export const accountTypesToV1 = {
  [AccountTypes.CONNECTEDWALLET]: AccountTypes_ApiV1.CONNECTEDWALLET,
  [AccountTypes.VIRTUALACCOUNT]: AccountTypes_ApiV1.VIRTUALACCOUNT,
};

export interface Account_ApiV1 {
  id: number;
  created_at: string;
  network: Network_ApiV1;
  commitment: string;
  name: string;
  closed: boolean;
  currency: Currency_ApiV1;
  balance: string;
  account_type: AccountTypes_ApiV1;
  creator_address: string;
}

export type SmartContract_ApiV1 = {
  network: Network_ApiV1;
  smart_contract: string;
  contract_type: AccountTypes_ApiV1;
};

export interface Currency_ApiV1 {
  name: string;
  native: boolean; // is it a native token , if true then contract address is false
  contractAddress: string;
}
export enum DynamicPaymentRequestJobsStatus_ApiV1 {
  CREATED = "Created",
  LOCKED = "Locked",
  COMPLETED = "Completed",
  REJECETED = "Rejected",
}

export interface DynamicPaymentRequest_ApiV1 {
  created_at: string;
  status: DynamicPaymentRequestJobsStatus_ApiV1;
  amount: string; // This is formatted ether in the DB, maybe I should serve it as WEI always!
  currency: Currency_ApiV1;
  chain_id: string;
}

export interface EventData_ApiV1 {
  paymentIntent: PaymentIntent_ApiV1;
  smartContract: SmartContract_ApiV1;
  dynamicPaymentRequest: DynamicPaymentRequest_ApiV1;
}

export interface WebhookEvents_ApiV1 {
  id: string; // A unique identifier for the event
  object: string; // "event";
  api_version: string; //"2023-09-24", // The last time the Api version was updated,
  type: EventTypes_ApiV1;
  data: EventData_ApiV1;
  status: SubscriptionStatus_ApiV1;
}

export const APIV1 = "https://debitllama.com/api/v1/";

export enum APIV1Endpoints_ApiV1 {
  payment_intents = APIV1 + "payment_intents/", // payment_intent,
  accounts = APIV1 + "accounts/", // commitment
  items = APIV1 + "items/", //id
}

export enum APIV1_AllowedMethods_ApiV1 {
  payment_intents = "GET,POST", // get all payment intents, get 1 payment intents when using path, post dynamicPayment request on path
  accounts = "GET", // get 1 account
  items = "GET,PUT,POST", // get item, put new item, post update redirect_url
  transaction_history = "GET", // get transaction history paginated
}

export enum Methods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export enum EndpointNames_ApiV1 {
  v1 = "/api/v1",
  accounts = "/api/v1/accounts",
  accountsSlug = "/api/v1/accounts/[slug]",
  items = "/api/v1/items",
  itemsSlug = "/api/v1/items/[slug]",
  paymentIntents = "/api/v1/payment_intents",
  paymentIntentsSlug = "/api/v1/payment_intents/[slug]",
}

export const endpoints_ApiV1: { [key in EndpointNames_ApiV1]: Array<Methods> } =
  {
    [EndpointNames_ApiV1.v1]: [Methods.GET],
    [EndpointNames_ApiV1.accounts]: [Methods.GET],
    [EndpointNames_ApiV1.accountsSlug]: [Methods.GET],
    [EndpointNames_ApiV1.items]: [Methods.GET, Methods.PUT],
    [EndpointNames_ApiV1.itemsSlug]: [Methods.GET, Methods.POST],
    [EndpointNames_ApiV1.paymentIntents]: [Methods.GET],
    [EndpointNames_ApiV1.paymentIntentsSlug]: [Methods.GET, Methods.POST],
  };

export const endpointDefinitions: { [key in EndpointNames_ApiV1]: string } = {
  [EndpointNames_ApiV1.v1]: "DebitLlama Api v1",
  [EndpointNames_ApiV1.accounts]:
    "GET: Accounts of access token owner paginated",
  [EndpointNames_ApiV1.accountsSlug]:
    "GET: an account by commitment and refresh owned account balance if authenticated!",
  [EndpointNames_ApiV1.items]:
    "GET all items of access token owner paginated,PUT: new item",
  [EndpointNames_ApiV1.itemsSlug]:
    "GET: Fetch an item by item_id. POST: Update redirect_url and deactivate item",
  [EndpointNames_ApiV1.paymentIntents]:
    "GET:All payment intents of access token owner paginated",
  [EndpointNames_ApiV1.paymentIntentsSlug]:
    "GET: payment intent by identifier, POST: Create a DynamicPaymentRequest",
};

export interface Link {
  href: string;
  methods: Array<Methods>;
}

export interface Base_ApiV1 {
  _self: Link; // This is the current path that was called
  _version: "v1";
  _description: string; // A short desciption of what the endpoint does
  _links: Array<Link>; //  Hyperlinks to visit and current link, only contains GET requests,
}

export interface V1Error {
  message: string;
  status: number;
  timestamp: string;
}

export interface ErrorResponse extends Base_ApiV1 {
  error: V1Error;
}

export interface ArtifactLink {
  name: string;
  href: string;
}

export interface v1_Index_Response extends Base_ApiV1 {
  artifacts: Array<ArtifactLink>;
  supported_networks: Array<Network_ApiV1>; // The blockchain networks supported by the application!
}

export interface v1_AccountsResponse extends Base_ApiV1 {
  accounts: Array<Account_ApiV1>;
  pagination: PaginationResponse_ApiV1;
  filters: Array<Filter>;
  availableFilters: Array<string>;
}

export interface v1_AccountResponse extends Base_ApiV1 {
  account: Account_ApiV1;
  all_payment_intents: {
    pagination: PaginationResponse_ApiV1;
    data: Array<PaymentIntent_ApiV1>;
    filter: Array<Filter>;
    availableFilters: Array<string>;
  };
  missing_payments: Array<PaymentIntent_ApiV1>;
}
export interface v1_Payment_intentsResponse extends Base_ApiV1 {
  paymentIntents: Array<PaymentIntent_ApiV1>;
  pagination: PaginationResponse_ApiV1;
  filter: Array<Filter>;
  availableFilters: Array<string>;
}
export interface v1_SinglePaymentIntentResponse extends Base_ApiV1 {
  paymentIntent: PaymentIntent_ApiV1 | any;
  dynamicPaymentRequest: DynamicPaymentRequest_ApiV1 | any;
}

export enum DynamicPaymentRequestResponseMessage {
  CREATEDREQUEST = "CREATEDREQUEST",
  CANCELLEDREQUEST = "CANCELLEDREQUEST",
}

export interface v1_DynamicPaymentRequesResponse extends Base_ApiV1 {
  result: { message: DynamicPaymentRequestResponseMessage; id: number };
}

export interface V1_ItemsResponse extends Base_ApiV1 {
  items: Array<DebitItem_ApiV1>;
  pagination: PaginationResponse_ApiV1;
  filter: Array<Filter>;
  availableFilters: Array<string>;
}

export interface PaginationResponse_ApiV1 {
  current_page: number; // The current page, depends on the total pages, with page size it will determine the paging parameters
  total_pages: number; // Total pages, matters in response on
  page_size: number; // Page size, client needs to pass to the server to know how to calculate size
  sort_by: string; // The column that is sorted
  sort_direction: string; // ASC or DESC
  sortable_columns: Array<string>; // Should return the colums that can be sorted
}

export interface Filter {
  parameter: string;
  value: string;
}

export interface PaginationSearchParams_ApiV1 {
  current_page: number | undefined; // The current page we are requesting, defaults to 1 if undefined
  page_size: number | undefined; // The size of the pages, used to override the default value : 10
  sort_by: string | undefined; // The column name to sort by, defaults to "created_at" when undefined
  sort_direction: string | undefined; // The ordering for the sorted column. Values can be "ASC" or "DESC" defaults to "DESC" if undefined"
}

export enum PaginationSearchQueryParams {
  current_page = "current_page",
  page_size = "page_size",
  sort_by = "sort_by",
  sort_direction = "sort_direction",
}

export enum Accounts_sortBy {
  created_at = "created_at",
  network_id = "network_id",
  name = "name",
  account_type = "account_type",
  creator_address = "creator_address",
  currency = "currency",
  balance = "balance",
  closed = "closed",
  last_modified = "last_modified",
}

export enum Accounts_filterKeys {
  network_id = "network_id",
  name = "name",
  account_type = "account_type",
  creator_address = "creator_address",
  currency = "currency",
  balance = "balance",
  closed = "closed",
}

export const getAccountsSortBy: { [key in Accounts_sortBy]: Accounts_sortBy } =
  // Why would I create this? What is the point? Well to validate strings, during runtime it's passed a string
  //and if it's not in the enum then it returns undefined. That's all
  {
    [Accounts_sortBy.created_at]: Accounts_sortBy.created_at,
    [Accounts_sortBy.network_id]: Accounts_sortBy.network_id,
    [Accounts_sortBy.name]: Accounts_sortBy.name,
    [Accounts_sortBy.account_type]: Accounts_sortBy.account_type,
    [Accounts_sortBy.creator_address]: Accounts_sortBy.creator_address,
    [Accounts_sortBy.currency]: Accounts_sortBy.currency,
    [Accounts_sortBy.balance]: Accounts_sortBy.balance,
    [Accounts_sortBy.closed]: Accounts_sortBy.closed,
    [Accounts_sortBy.last_modified]: Accounts_sortBy.last_modified,
  };

export const checksAccounts_filterKeys: {
  [key in Accounts_filterKeys]: boolean;
} = {
  [Accounts_filterKeys.name]: true,
  [Accounts_filterKeys.network_id]: true,
  [Accounts_filterKeys.creator_address]: true,
  [Accounts_filterKeys.currency]: true,
  [Accounts_filterKeys.closed]: true,
  [Accounts_filterKeys.balance]: true,
  [Accounts_filterKeys.account_type]: true,
};

export const validate_Accounts_filterKeys: {
  [key in Accounts_filterKeys]: CallableFunction;
} = {
  [Accounts_filterKeys.name]: (val: string) => {
    // it could be anything
  },
  [Accounts_filterKeys.network_id]: (val: string) => {
    const name = networkNameFromId[val as ChainIds];
    if (!name) {
      throw new Error("Invalid network_id filter parameter");
    }
  },
  [Accounts_filterKeys.creator_address]: (val: string) => {
    if (!ethers.isAddress(val)) {
      throw new Error("Invalid creator_address filter parameter");
    }
  },
  [Accounts_filterKeys.currency]: (val: string) => {
    const decoded = JSON.parse(val);
    if (!decoded.name) {
      throw new Error("Invalid currency filter parameter name");
    }
    if (decoded.native === undefined || decoded.native === "") {
      throw new Error("Invalid currency filter parameter native");
    }
    if (decoded.contractAddress === undefined) {
      throw new Error("Invalid currency filter paramerer contractAddress");
    }
  },
  [Accounts_filterKeys.closed]: (val: any) => {
    if (typeof val !== "boolean") {
      throw new Error("Invalid closed filter parameter, must be boolean");
    }
  },
  [Accounts_filterKeys.balance]: (val: any) => {
    if (isNaN(parseFloat(val))) {
      throw new Error("Invalid balance filter parameter, must be valid float");
    }
  },
  [Accounts_filterKeys.account_type]: (val: any) => {
    if (
      val !== AccountTypes.CONNECTEDWALLET &&
      val !== AccountTypes.VIRTUALACCOUNT
    ) {
      throw new Error(
        "Invalid account type! Must be either CONNECTEDWALLET or VIRTUALACCOUNT",
      );
    }
  },
};

export enum PaymentIntents_sortyBy {
  created_at = "created_at",
  payee_address = "payee_address",
  max_debit_amount = "max_debit_amount",
  debit_times = "debit_times",
  debit_interval = "debit_interval",
  payment_intent = "payment_intent",
  status_text = "status_text",
  estimated_gas = "estimated_gas",
  last_payment_date = "last_payment_date",
  next_payment_date = "next_payment_date",
  pricing = "pricing",
  currency = "currency",
  debit_item_id = "debit_item_id",
}

export enum Items_sortBy {
  created_at = "created_at",
  payee_address = "payee_address",
  currency = "currency",
  max_price = "max_price",
  debit_times = "debit_times",
  debit_interval = "debit_interval",
  button_id = "button_id",
  redirect_url = "redirect_url",
  pricing = "pricing",
  network = "network",
  name = "name",
  deleted = "deleted",
  payment_intents_count = "payment_intents_count",
}

export enum PaymentIntents_filterKeys {
  payee_address = "payee_address",
  max_debit_amount = "max_debit_amount",
  debit_times = "debit_times",
  debit_interval = "debit_interval",
  status_text = "status_text",
  pricing = "pricing",
  currency = "currency",
  debit_item_id = "debit_item_id",
}

export const mapPaymentIntentSortByKeysToDBColNames = {
  [PaymentIntents_sortyBy.created_at]: "created_at",
  [PaymentIntents_sortyBy.payee_address]: "payee_address",
  [PaymentIntents_sortyBy.max_debit_amount]: "maxDebitAmount",
  [PaymentIntents_sortyBy.debit_times]: "debitTimes",
  [PaymentIntents_sortyBy.debit_interval]: "debitInterval",
  [PaymentIntents_sortyBy.payment_intent]: "paymentIntent",
  [PaymentIntents_sortyBy.status_text]: "statusText",
  [PaymentIntents_sortyBy.estimated_gas]: "estimatedGas",
  [PaymentIntents_sortyBy.last_payment_date]: "lastPaymentDate",
  [PaymentIntents_sortyBy.next_payment_date]: "nextPaymentDate",
  [PaymentIntents_sortyBy.pricing]: "pricing",
  [PaymentIntents_sortyBy.currency]: "currency",
  [PaymentIntents_sortyBy.debit_item_id]: "debit_item_id",
};

export const getPaymentIntentsSortBy: {
  [key in PaymentIntents_sortyBy]: PaymentIntents_sortyBy;
} = {
  [PaymentIntents_sortyBy.created_at]: PaymentIntents_sortyBy.created_at,
  [PaymentIntents_sortyBy.payee_address]: PaymentIntents_sortyBy.payee_address,
  [PaymentIntents_sortyBy.max_debit_amount]:
    PaymentIntents_sortyBy.max_debit_amount,
  [PaymentIntents_sortyBy.debit_times]: PaymentIntents_sortyBy.debit_times,
  [PaymentIntents_sortyBy.debit_interval]:
    PaymentIntents_sortyBy.debit_interval,
  [PaymentIntents_sortyBy.payment_intent]:
    PaymentIntents_sortyBy.payment_intent,
  [PaymentIntents_sortyBy.status_text]: PaymentIntents_sortyBy.status_text,
  [PaymentIntents_sortyBy.estimated_gas]: PaymentIntents_sortyBy.estimated_gas,
  [PaymentIntents_sortyBy.last_payment_date]:
    PaymentIntents_sortyBy.last_payment_date,
  [PaymentIntents_sortyBy.next_payment_date]:
    PaymentIntents_sortyBy.next_payment_date,
  [PaymentIntents_sortyBy.pricing]: PaymentIntents_sortyBy.pricing,
  [PaymentIntents_sortyBy.currency]: PaymentIntents_sortyBy.currency,
  [PaymentIntents_sortyBy.debit_item_id]: PaymentIntents_sortyBy.debit_item_id,
};

export const getItemsSortBy: {
  [key in Items_sortBy]: Items_sortBy;
} = {
  [Items_sortBy.created_at]: Items_sortBy.created_at,
  [Items_sortBy.payee_address]: Items_sortBy.payee_address,
  [Items_sortBy.currency]: Items_sortBy.currency,
  [Items_sortBy.max_price]: Items_sortBy.max_price,
  [Items_sortBy.debit_times]: Items_sortBy.debit_times,
  [Items_sortBy.debit_interval]: Items_sortBy.debit_interval,
  [Items_sortBy.button_id]: Items_sortBy.button_id,
  [Items_sortBy.redirect_url]: Items_sortBy.redirect_url,
  [Items_sortBy.pricing]: Items_sortBy.pricing,
  [Items_sortBy.network]: Items_sortBy.network,
  [Items_sortBy.name]: Items_sortBy.name,
  [Items_sortBy.deleted]: Items_sortBy.deleted,
  [Items_sortBy.payment_intents_count]: Items_sortBy.payment_intents_count,
};

export const checksPaymentIntents_filterKeys: {
  [key in PaymentIntents_filterKeys]: boolean;
} = {
  [PaymentIntents_filterKeys.payee_address]: true,
  [PaymentIntents_filterKeys.max_debit_amount]: true,
  [PaymentIntents_filterKeys.debit_times]: true,
  [PaymentIntents_filterKeys.debit_interval]: true,
  [PaymentIntents_filterKeys.status_text]: true,
  [PaymentIntents_filterKeys.pricing]: true,
  [PaymentIntents_filterKeys.currency]: true,
  [PaymentIntents_filterKeys.debit_item_id]: true,
};

export const validate_PaymentIntents_filterKeys: {
  [key in PaymentIntents_filterKeys]: CallableFunction;
} = {
  [PaymentIntents_filterKeys.payee_address]: (val: any) => {
    if (!ethers.isAddress(val)) {
      throw new Error("Invalid payee_address filter parameter!");
    }
  },
  [PaymentIntents_filterKeys.max_debit_amount]: (val: any) => {
    if (isNaN(parseFloat(val))) {
      throw new Error(
        "Invalid max_debit_amount filter parameter. Must be valid float string!",
      );
    }
  },
  [PaymentIntents_filterKeys.debit_times]: (val: any) => {
    if (isNaN(parseInt(val))) {
      throw new Error("Invalid debit_times filter parameter. Must be integer.");
    }
  },
  [PaymentIntents_filterKeys.debit_interval]: (val: any) => {
    if (isNaN(parseInt(val))) {
      throw new Error(
        "Invalid debit_interval filter parameter. Must be integer",
      );
    }
  },
  [PaymentIntents_filterKeys.status_text]: (val: any) => {
    if (!validatePaymentIntentStatus_ApiV1[val as PaymentIntentStatus_ApiV1]) {
      throw new Error("Invalid Payment Intent Status filter parameter.");
    }
  },
  [PaymentIntents_filterKeys.pricing]: (val: any) => {
    if (val !== Pricing_ApiV1.Dynamic && val !== Pricing_ApiV1.Fixed) {
      throw new Error(
        "Invalid Pricing filter parameter. Must be Dynamic or Fixed",
      );
    }
  },
  [PaymentIntents_filterKeys.currency]: (val: any) => {
    const decoded = JSON.parse(val);
    if (!decoded.name) {
      throw new Error("Invalid currency filter parameter name");
    }
    if (decoded.native === undefined || decoded.native === "") {
      throw new Error("Invalid currency filter parameter native");
    }
    if (decoded.contractAddress === undefined) {
      throw new Error("Invalid currency filter paramerer contractAddress");
    }
  },
  [PaymentIntents_filterKeys.debit_item_id]: (val: any) => {
    if (isNaN(parseInt(val))) {
      throw new Error("Invalid debit_item_id parameter. Must be valid integer");
    }
  },
};

export const getSortableColumns: {
  [key in EndpointNames_ApiV1]: Array<string>;
} = {
  [EndpointNames_ApiV1.v1]: [],
  [EndpointNames_ApiV1.accounts]: Object.entries(Accounts_sortBy).map((ent) =>
    ent[0]
  ),
  [EndpointNames_ApiV1.accountsSlug]: Object.entries(PaymentIntents_sortyBy)
    .map((ent) => ent[0]),
  [EndpointNames_ApiV1.items]: Object.entries(Items_sortBy).map((ent) =>
    ent[0]
  ),
  [EndpointNames_ApiV1.itemsSlug]: [],
  [EndpointNames_ApiV1.paymentIntents]: Object.entries(PaymentIntents_sortyBy)
    .map((ent) => ent[0]),
  [EndpointNames_ApiV1.paymentIntentsSlug]: [],
};

export interface PaymentIntent_ZapierFormat {
  name: string;
  created_at: string;
  payment_intent: string;
  status_text: PaymentIntentStatus_ApiV1;
  payee_address: string;
  max_debit_amount: string;
  debit_times: number;
  debit_interval: number;
  last_payment_date: string; // UTC strinng
  next_payment_date: string; // UTC string
  pricing: Pricing_ApiV1;
  currency_name: string;
  native_currency: string;
  currency_address: string;
  network: string;
  transactions_left: number; // calulated like: debit_times - used_for
  failed_dynamic_payment_amount: string;
}
