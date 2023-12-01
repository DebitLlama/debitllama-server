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

export interface EmailContent {
  content: string;
  html: string;
}

export interface PaymentStatementArgs {
  subscriptionLink: string;
}

export interface EmailContent {
  content: string;
  html: string;
}

export interface ContentArgs {
  emailAddress: string;
  subscriptionLink: string;
}

export enum EmailType {
  SubscriptionCreatedCustomer = "SubsciptionCreatedCustomer",
  SubscriptionCreatedMerchant = "SubscriptionCreatedMerchant",
  SubscriptionCancelledCustomer = "SubscriptionCancelledCustomer",
  SubscriptionCancelledMerchant = "SubscriptionCancelledMerchant",
  SubscriptionEndedCustomer = "SubscriptionEndedCustomer",
  SubscriptionEndedMerchant = "SubscriptionEndedMerchant",
  PaymentMerchant = "Paymentmerchant",
  PaymentCustomer = "PaymentCustomer",
  PaymentFailureMerchant = "PaymentFailureMerchant",
  PaymentFailureCustomer = "PaymentFailureCustomer",
  DynamicPaymentRequestRejected = "DynamicPaymentRequestRejected",
}

export enum EventType {
  SubscriptionCreated = "SubscriptionCreated",
  SubscriptionCancelled = "SubscriptionCancelled",
  SubscriptionEnded = "SubscriptionEnded",
  Payment = "Payment",
  PaymentFailure = "PaymentFailure",
  DynamicPaymentRequestRejected = "DynamicPaymentRequestRejected",
}

export const MapCustomerEmailRequestType: {
  [key in EventType]: EmailType;
} = {
  [EventType.SubscriptionCreated]: EmailType.SubscriptionCreatedCustomer,

  [EventType.SubscriptionCancelled]: EmailType.SubscriptionCancelledCustomer,

  [EventType.SubscriptionEnded]: EmailType.SubscriptionEndedCustomer,

  [EventType.Payment]: EmailType.PaymentCustomer,

  [EventType.PaymentFailure]: EmailType.PaymentFailureCustomer,

  [EventType.DynamicPaymentRequestRejected]:
    EmailType.DynamicPaymentRequestRejected,
};

export const MapMerchantEmailRequestType: {
  [key in EventType]: EmailType;
} = {
  [EventType.SubscriptionCreated]: EmailType.SubscriptionCreatedMerchant,
  [EventType.SubscriptionCancelled]: EmailType.SubscriptionCancelledMerchant,
  [EventType.SubscriptionEnded]: EmailType.SubscriptionEndedMerchant,
  [EventType.Payment]: EmailType.PaymentMerchant,
  [EventType.PaymentFailure]: EmailType.PaymentFailureMerchant,
  [EventType.DynamicPaymentRequestRejected]:
    EmailType.DynamicPaymentRequestRejected,
};

export type PartyType = "active" | "empty";

export type Party = {
  type: PartyType;
  email: string;
  amount: string;
};

export type RequestJson = {
  type: EventType;
  customer: Party;
  merchant: Party;
};

// export type SubscriptionEventRequest = {
//   type: EventType;
//   email: {
//     send_email: boolean;
//     customer: Party;
//     merchant: Party;
//     payment_intent: string;
//   };
//   configured_webhook: {
//     trigger_configured_hook: boolean;
//     url: string;
//     authorization: string;
//     payment_intent: string; // The payment intent identifier string
//   };
//   zapier_webhook: {
//     trigger_zapier_webhook: boolean;
//     url: string;
//     payment_intent_data: PaymentIntent_ZapierFormat; //Zapier webhook needs the payment intent data in an array afterwards
//   };
// };

export enum AppLinks {
  createdPaymentIntents = "https://debitllama.com/app/createdPaymentIntents?q=",
  payeePaymentIntents = "https://debitllama.com/app/payeePaymentIntents?q="
}