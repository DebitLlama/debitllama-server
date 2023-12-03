import {
  ContentArgs,
  EmailContent,
  EmailType,
  PaymentStatementArgs,
} from "../types.ts";

export interface SubscriptionArgs extends ContentArgs {
  paymentIntentLink: string;
}
//New subscription created

export const newSubscriptionAcceptedCustomer = (
  args: PaymentStatementArgs,
): EmailContent => {
  const html = `<div style="text-align: center;">
    <h2 style="margin: 0 auto;">New Subscription</h2>
    <p>A new Subsciption was created.</p>
    <p>You can see it <a href="${args.subscriptionLink}" target="_blank">here</a></p>
    <p>If you didn't create this subscription, you should cancel it asap using the dashboard!</p>
    <p>The first payment will be processed 30 minutes after the subscription was created.</p>
    </div>`;

  return {
    content:
      `A new Subscription was created. ${args.subscriptionLink}\n If you didn't create this subscription, you should cancel it using the dashboard!`,
    html,
  };
};

export const newSubscriptionAcceptedMerchant = (
  args: PaymentStatementArgs,
): EmailContent => {
  const html = `<div style="text-align: center;">
    <h2 style="margin: 0 auto;">New Subscription</h2>
    <p>A new Subsciption was created.</p>
    <p>You can see it <a href="${args.subscriptionLink}" target="_blank">here</a></p>
    <p>If you don't want to accept this subscription, you should cancel it asap using the dashboard!</p>
    <p>The first payment will be processed 30 minutes after the subscription was created.</p>
    </div>`;

  return {
    content:
      `A new subscription was created. \n${args.subscriptionLink}.\n If you don't want to accept this subscription, cancel it asap.`,
    html,
  };
};

// Subscription cancelled

export const SubscriptionCancelledCustomer = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `Your subscription is cancelled! You can find the details at ${args.subscriptionLink}`,
    html:
      `<p>Your subscription is cancelled! You can find more details at the <a href="${args.subscriptionLink}" target="_blank">link here</a></p>`,
  };
};

export const SubscriptionCancelledMerchant = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `A Subscription was cancelled!\n Learn more about it at: ${args.subscriptionLink}`,
    html:
      `<p>A Subscription was cancelled. Learn more about it <a ${args.subscriptionLink} target="_blank">here</a></p>`,
  };
};

//Subscription ended!
export const SubscriptionEndedCustomer = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `Your subscription period is ending! You can find the details at ${args.subscriptionLink}`,
    html:
      `<p>Your subscription period is ending! You can find more details at the <a href="${args.subscriptionLink}" target="_blank">link here</a></p>`,
  };
};

export const SubscriptionEndedMerchant = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `A Subscription period has ended!\n Learn more about it at: ${args.subscriptionLink}`,
    html:
      `<p>A Subscription period has ended! Learn more about it <a ${args.subscriptionLink} target="_blank">here</a></p>`,
  };
};

//Subscription payments

export const PaymentStatementCustomer = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `Successful payment!\n See the Subscription for more details ${args.subscriptionLink}`,
    html: `<div style="text-align: center;">
    <h2 style="margin: 0 auto;">Successful Payment</h2>
    <p>See the <a href="${args.subscriptionLink}" target="_blank" >Subscription</a> for more details!</p>
    </div>`,
  };
};

export const PaymentStatementMerchant = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `Payment Statement. Your have received a new subscription payment! \n See the payment intent for more details ${args.subscriptionLink}`,
    html: `<div style="text-align: center;">
    <h2 style="margin: 0 auto;">Payment Statement</h2>
    <p>You have received a new subscription payment!</p>
    <p>See the <a href="${args.subscriptionLink}" target="_blank">Payment Intent</a> for more details!</p>
    </div>`,
  };
};

//Subsciption payments failed

export const PaymentFailureCustomer = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `You have insufficient balance in your account to continue payments. The merchant may cancel your subscription. To continue please update your balance using the accounts dashboard! \n ${args.subscriptionLink}`,
    html:
      `<p>You have insufficient balance in your account to continue payments, the merchant may cancel your subscription. To continue please update your balance! You can find more details at the <a href="${args.subscriptionLink}" target="_blank">link here</a></p>`,
  };
};

export const PaymentFailureMerchant = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content: `Your payment request has failed. ${args.subscriptionLink}`,
    html:
      `<p>Your payment request has failed! You can find more details at the <a href="${args.subscriptionLink}" target="_blank">link here</a></p>`,
  };
};

//Dynamic Payment Request Failed!

export const DynamicPaymentRequestRejected = (
  args: PaymentStatementArgs,
): EmailContent => {
  return {
    content:
      `Your payment request was rejected. We are unable to process it this time. Please create a new request.\n ${args.subscriptionLink}`,
    html:
      `<p>Your payment request was rejected. We are unable to process it this time. Please create a new request <a href="${args.subscriptionLink}" target="_blank">here</a></p>`,
  };
};

export function getEmailContent(
  reason: EmailType,
  args: PaymentStatementArgs,
): EmailContent {
  switch (reason) {
    case EmailType.SubscriptionCreatedCustomer:
      return newSubscriptionAcceptedCustomer(args);

    case EmailType.SubscriptionCreatedMerchant:
      return newSubscriptionAcceptedMerchant(args);

    case EmailType.SubscriptionCancelledCustomer:
      return SubscriptionCancelledCustomer(args);

    case EmailType.SubscriptionCancelledMerchant:
      return SubscriptionCancelledMerchant(args);

    case EmailType.SubscriptionEndedCustomer:
      return SubscriptionEndedCustomer(args);
    case EmailType.SubscriptionEndedMerchant:
      return SubscriptionEndedMerchant(args);
    case EmailType.PaymentCustomer:
      return PaymentStatementCustomer(args);

    case EmailType.PaymentMerchant:
      return PaymentStatementMerchant(args);

    case EmailType.PaymentFailureMerchant:
      return PaymentFailureMerchant(args);

    case EmailType.PaymentFailureCustomer:
      return PaymentFailureCustomer(args);

    case EmailType.DynamicPaymentRequestRejected:
      return DynamicPaymentRequestRejected(args);

    default:
      return { content: "", html: "" };
  }
}

export const getEmailSubject: { [key in EmailType]: string } = {
  [EmailType.SubscriptionCreatedCustomer]: "New Subscription",
  [EmailType.SubscriptionCreatedMerchant]: "New Subscription",
  [EmailType.SubscriptionCancelledCustomer]: "Subscription Cancelled",
  [EmailType.SubscriptionCancelledMerchant]: "Subscription Cancelled",
  [EmailType.SubscriptionEndedCustomer]: "Your Subscription Ended",
  [EmailType.SubscriptionEndedMerchant]: "A Subscription Ended",
  [EmailType.DynamicPaymentRequestRejected]: "Payment Request Failed",
  [EmailType.PaymentCustomer]: "Payment Notification",
  [EmailType.PaymentMerchant]: "Payment Notification",
  [EmailType.PaymentFailureCustomer]: "Payment Failed",
  [EmailType.PaymentFailureMerchant]: "Payment Failed",
};
