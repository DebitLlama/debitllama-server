export enum PaymentIntentStatus {
  CREATED = "Created",
  CANCELLED = "Cancelled",
  RECURRING = "Recurring",
  PAID = "Paid",
  BALANCETOOLOWTORELAY = "Balance too low to relay",
  ACCOUNTBALANCETOOLOW = "Account Balance too low",
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

export type PaymentIntentRow = {
  id: number;
  created_at: string;
  creator_user_id: number;
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
};

export type RelayerBalance = {
  id: number;
  created_at: string;
  BTT_Donau_Testnet_Balance: string;
  Missing_BTT_Donau_Testnet_Balance: string;
  user_id: string;
  last_topup: string;
};

// 10 Payment intents will be displayed in a
export const PAYMENTINTENTSPAGESIZE = 10;

export enum PaymentIntentsTableColNames {
  Identifier = "Identifier",
  Status = "Status",
  Payment = "Payment",
  DebitTimes = "DebitTimes",
  UsedFor = "used_for",
  NextPayment = "NextPayment",
  CreatedDate = "CreatedDate",
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
};

export enum FilterFor {
  PaymentIntents,
  TransactionHistory,
  DebitItems,
  RelayerTopupHistory,
}
