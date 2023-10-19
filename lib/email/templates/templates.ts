export interface EmailContent {
  content: string;
  html: string;
}

export interface ContentArgs {
  emailAddress: string;
}

export const signupContent = (args: ContentArgs): EmailContent => {
  return {
    content: "Thank you for signing up to DebitLlama.com",
    html: "<p>Thank you for signing up to DebitLlama.com</p>.",
  };
};

export interface VerifyEmailArgs extends ContentArgs {
  verifyUrl: string;
}

export const verifyEmailTemplates = (
  args: VerifyEmailArgs,
): EmailContent => {
  return {
    content: `Click the link to verify your email address ${args.verifyUrl}`,
    html:
      `<p>Click this <a href="${args.verifyUrl}" target="_blank">link</a> to verify your email address!</p>`,
  };
};

export interface PasswordResetArgs extends ContentArgs {
  resetUrl: string;
}

export const passwordResetTemplate = (
  args: PasswordResetArgs,
): EmailContent => {
  return {
    content: `Click the link to reset your password ${args.resetUrl} `,
    html:
      `<p>Click this <a href="${args.resetUrl}" target="_blank" >link</a>to reset your password!</p>`,
  };
};

export interface SubscriptionArgs extends ContentArgs {
  paymentIntentLink: string;
}
export const newSubscriptionAcceptedCustomer = (
  args: SubscriptionArgs,
): EmailContent => {
  const html = `<div style="text-align: center;">
    <h2 style="margin: 0 auto;">New Subscription</h2>
    <p>A new Subsciption was created.</p>
    <p>You can see it <a href="${args.paymentIntentLink}" target="_blank">here</a></p>
    <p>If you didn't create this subscription, you should cancel it asap using the dashboard!</p>
    <p>The first payment will be processed 30 minutes after the subscription was created.</p>
    </div>`;

  return {
    content:
      `A new Subscription was created. ${args.paymentIntentLink}\n If you didn't create this subscription, you should cancel it using the dashboard!`,
    html,
  };
};

export const newSubscriptionAcceptedMerchant = (
  args: SubscriptionArgs,
): EmailContent => {
  const html = `<div style="text-align: center;">
    <h2 style="margin: 0 auto;">New Subscription</h2>
    <p>A new Subsciption was created.</p>
    <p>You can see it <a href="${args.paymentIntentLink}" target="_blank">here</a></p>
    <p>If you don't want to accept this subscription, you should cancel it asap using the dashboard!</p>
    <p>The first payment will be processed 30 minutes after the subscription was created.</p>
    </div>`;

  return {
    content:
      `A new subscription was created. \n${args.paymentIntentLink}.\n If you don't want to accept this subscription, cancel it asap.`,
    html,
  };
};

export const SubscriptionCancelledPayee = (
  args: SubscriptionArgs,
): EmailContent => {
  return {
    content:
      `A Subscription has been cancelled!\n Learn more about it at: ${args.paymentIntentLink}`,
    html:
      `<p>A Subscription has been cancelled. Learn more about it <a ${args.paymentIntentLink} target="_blank">here</a></p>`,
  };
};

export const SubscriptionCancelledCustomer = (
  args: SubscriptionArgs,
): EmailContent => {
  return {
    content:
      `You have cancelled a subscription! You can find the details at ${args.paymentIntentLink}`,
    html:
      `<p>You have cancelled a subscription! You can find more details at the <a href="${args.paymentIntentLink}" target="_blank">link here</a></p>`,
  };
};
