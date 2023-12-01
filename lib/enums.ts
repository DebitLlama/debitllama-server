export enum AccountTypes {
  VIRTUALACCOUNT = "VIRTUALACCOUNT",
  CONNECTEDWALLET = "CONNECTEDWALLET",
}

export enum PaymentIntentStatus {
  CREATED = "CREATED",
  CANCELLED = "CANCELLED",
  RECURRING = "RECURRING",
  PAID = "PAID",
  BALANCETOOLOWTORELAY = "BALANCETOOLOWTORELAY",
  ACCOUNTBALANCETOOLOW = "ACCOUNTBALANCETOOLOW",
}

export enum Pricing {
  Fixed = "Fixed",
  Dynamic = "Dynamic",
}

export enum DynamicPaymentRequestJobsStatus {
  CREATED = "Created",
  LOCKED = "Locked",
  COMPLETED = "Completed",
  REJECETED = "Rejected",
}

export enum FilterFor {
  PaymentIntents,
  TransactionHistory,
  DebitItems,
  RelayerTopupHistory,
}

export enum PaymentIntentsTablePages {
  ACCOUNTS,
  DEBITITEMS,
  ITEM,
}

export enum DocsLinks {
  LINKTODOCSSTART = "https://debitllama.gitbook.io/debitllama/",
  REDIRECTURLSPEC = "https://debitllama.gitbook.io/debitllama/",
  APIDOCS = "https://debitllama.gitbook.io/debitllama/",
  WEBHOOKDOCS =
    "https://debitllama.gitbook.io/debitllama/rest-api-v1/configuring-webhooks",
}

export type PaymentIntentRow = {
  id: number;
  created_at: string;
  creator_user_id: string;
  payee_user_id: string;
  account_id: Account;
  payee_address: string;
  maxDebitAmount: string;
  debitTimes: number;
  debitInterval: number;
  paymentIntent: string;
  commitment: string;
  estimatedGas: string;
  statusText: string;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  pricing: string;
  currency: string;
  network: string;
  debit_item_id: DebitItem;
  used_for: number;
  proof: string;
  publicSignals: string;
  failedDynamicPaymentAmount: string;
};

export type Account = {
  id: number;
  created_at: string;
  user_id: string;
  network_id: string;
  commitment: string;
  name: string;
  closed: boolean;
  currency: string;
  balance: string;
  accountType: AccountTypes;
  creator_address: string;
};

export type DebitItem = {
  id: number;
  created_at: string;
  payee_id: string;
  payee_address: string;
  currency: string;
  max_price: string;
  debit_times: number;
  debit_interval: number;
  button_id: string;
  redirect_url: string;
  pricing: string;
  network: string;
  name: string;
  deleted: boolean;
  payment_intents_count: number;
  email_notifications: boolean;
};

export type RelayerBalance = {
  id: number;
  created_at: string;
  BTT_Donau_Testnet_Balance: string;
  Missing_BTT_Donau_Testnet_Balance: string;
  BTT_Mainnet_Balance: string;
  Missing_BTT_Mainnet_Balance: string;
  user_id: string;
  last_topup: string;
};

// 10 Payment intents will be displayed in a
export const PAYMENTINTENTSPAGESIZE = 10;
export const DEBITITEMSTABLEPAGESIZE = 10;
export const RELAYERTOPUPHISTORYPAGESIZE = 10;
export const RELAYERTRANSACTIONHISTORYPAGESIZE = 10;

export enum PaymentIntentsTableColNames {
  Identifier = "Identifier",
  Status = "Status",
  Payment = "Payment",
  DebitTimes = "DebitTimes",
  UsedFor = "used_for",
  NextPayment = "NextPayment",
  CreatedDate = "CreatedDate",
  Network = "Network",
}

export const MapPaymentIntentsTableColNamesToDbColNames: {
  [key in PaymentIntentsTableColNames]: string;
} = {
  [PaymentIntentsTableColNames.Identifier]: "paymentIntent",
  [PaymentIntentsTableColNames.Status]: "statusText",
  [PaymentIntentsTableColNames.Payment]: "maxDebitAmount",
  [PaymentIntentsTableColNames.DebitTimes]: "debitTimes",
  [PaymentIntentsTableColNames.UsedFor]: "used_for", // Need to calculate it, with debit times - used_for
  [PaymentIntentsTableColNames.NextPayment]: "nextPaymentDate",
  [PaymentIntentsTableColNames.CreatedDate]: "created_at",
  [PaymentIntentsTableColNames.Network]: "network",
};

export enum DebitItemTableColNames {
  PaymentIntentsCount = "payment_intents_count",
  Name = "name",
  Network = "network",
  Pricing = "pricing",
  MaxPrice = "max_price",
  DebitInterval = "debit_interval",
  DebitTimes = "debit_times",
  CreatedAt = "created_at",
}

// This is good for verifying the enum strings coming from the API are valid!
export const MapDebitItemsTableColNamesToDbColNames: {
  [key in DebitItemTableColNames]: string;
} = {
  [DebitItemTableColNames.PaymentIntentsCount]: "payment_intents_count",
  [DebitItemTableColNames.Name]: "name",
  [DebitItemTableColNames.Network]: "network",
  [DebitItemTableColNames.Pricing]: "pricing",
  [DebitItemTableColNames.MaxPrice]: "max_price",
  [DebitItemTableColNames.DebitInterval]: "debit_interval",
  [DebitItemTableColNames.DebitTimes]: "debit_times",
  [DebitItemTableColNames.CreatedAt]: "created_at",
};

export enum RelayerTopupHistoryColNames {
  Amount = "Amount",
  Date = "Date",
  Network = "Network",
}

export const MapRelayerTopupHistoryColnamesToDbColNames: {
  [key in RelayerTopupHistoryColNames]: string;
} = {
  [RelayerTopupHistoryColNames.Date]: "created_at",
  [RelayerTopupHistoryColNames.Amount]: "Amount",
  [RelayerTopupHistoryColNames.Network]: "network",
};

export enum RelayerTxHistoryColNames {
  Date = "Date",
  Network = "Network",
  GasUsed = "GasUsed",
  PaymentAmount = "paymentAmount",
  PaymentCurrency = "paymentCurerncy",
}

export const MapRelayerTxHistoryColnamesToDbColNames: {
  [key in RelayerTxHistoryColNames]: string;
} = {
  [RelayerTxHistoryColNames.Date]: "created_at",
  [RelayerTxHistoryColNames.GasUsed]: "allGasUsed",
  [RelayerTxHistoryColNames.Network]: "network",
  [RelayerTxHistoryColNames.PaymentAmount]: "paymentAmount",
  [RelayerTxHistoryColNames.PaymentCurrency]: "paymentCurrency",
};

export enum CookieNames {
  supaLogin = "supaLogin",
  renderSidebarOpen = "renderSidebarOpen",
  loginRedirect = "loginRedirect",
  profileRedirect = "profileRedirect",
}

// The pages where the auth should run!
export enum AuthWhitelist {
  app = "/app",
  buyitnow = "/buyitnow",
}

export enum TokenExpiry {
  ONEMONTH = "ONEMONTH",
  SIXMONTHS = "SIXMONTHS",
  ONEYEAR = "ONEYEAR",
  NEVER = "NEVER",
}

export const monthsToDate: {
  [keys in TokenExpiry]: CallableFunction;
} = {
  [TokenExpiry.ONEMONTH]: () => addToCurrentDate(1),
  [TokenExpiry.SIXMONTHS]: () => addToCurrentDate(6),
  [TokenExpiry.ONEYEAR]: () => addToCurrentDate(12),
  [TokenExpiry.NEVER]: () => addToCurrentDate(1200), // Gonna expire in 100 years if never is selected
};

function addToCurrentDate(months: number) {
  const currentDate = new Date();
  const newdate = new Date(
    currentDate.setMonth(currentDate.getMonth() + months),
  );
  return newdate.toUTCString();
}

export enum ApiAccessErrors {
  InvalidExpiryDate = "Invalid Expiry Date",
}

export type AccessTokenRow = {
  id: number;
  created_at: string;
  access_token: string;
  creator_id: string;
  expiry_date_utc: string;
};

export enum TemporaryUrlsType {
  VERIFYEMAILADDRESS = "VERIFYEMAILADDRESS",
  PASSWORDRESETLINK = "PASSWORDRESETLINK",
}

export enum EMAILCONSTANTS {
  noreply = "noreply@debitllama.com",
  verifyEmailUrlBase = "https://debitllama.com/verifyEmail?q=",
  verifyEmailSubject = "Verify your email address",
  passwordResetUrlBase = "https://debitllama.com/passwordreset?q=",
  passwordResetSubject = "Password reset requested",
  newSubscription = "New subscription",
  createdPaymentIntents = "https://debitllama.com/app/createdPaymentIntents?q=",
  payeePaymentIntents = "https://debitllama.com/app/payeePaymentIntents?q=",
}

export enum AccountAccess {
  password = "password",
  metamask = "metamask",
  passkey = "passkey",
}

export type DynamicPaymentRequestJobRow = {
  id: number;
  created_at: string;
  paymentIntent_id: PaymentIntentRow;
  requestedAmount: string;
  status: string;
  request_creator_id: string;
  allocatedGas: string;
  relayerBalance_id: number;
};

export type WebhooksRow = {
  id: number;
  created_at: string;
  creator_id: string;
  webhook_url: string;
  on_subscription_created: boolean;
  on_payment_success: boolean;
  on_payment_failure: boolean;
  on_dynamic_payment_request_rejected: boolean;
  on_subscription_cancelled: boolean;
  _authorization_: string;
};

export type ZapierWebhooksRow = {
  id: number;
  created_at: string;
  user_id: string;
  subscription_created_url: string;
  subscription_cancelled_url: string;
  payment_url: string;
  payment_failure_url: string;
  dynamic_payment_request_rejected_url: string;
};
