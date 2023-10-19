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

export const passwordResetTemplate = (args: PasswordResetArgs): EmailContent => {
  return {
    content: `Click the link to reset your password ${args.resetUrl} `,
    html:
      `<p>Click this <a href="${args.resetUrl}" target="_blank" >link</a>to reset your password!</p>`,
  };
};

export interface SubsciptionArgs extends ContentArgs {
  paymentIntentLink: string;
}
export const newSubsciptionAcceptedMerchant = (
  args: SubsciptionArgs,
): EmailContent => {
  return {
    content: `A new Subsciption was created. ${args.paymentIntentLink}`,
    html:
      `<p>A new Subsciption was created. Visit the <a href="${args.paymentIntentLink}" target="_blank" >link</a> to see more details.</p>`,
  };
};

export const newSubsciptionAcceptedCustomer = (
  args: SubsciptionArgs,
): EmailContent => {
  return {
    content:
      `A new subsciption was created. \n${args.paymentIntentLink}.\n If you did not create this subsciption you can cancel it immediately!`,
    html:
      `<p>A new subsciption was created. Visit the <a href="${args.paymentIntentLink}">link</a> to learn more. If you did not create this subsciption you can cancel it immediately! </p>`,
  };
};



export const SubsciptionCancelledPayee = (
  args: SubsciptionArgs,
): EmailContent => {
  return {
    content:
      `A Subsciption has been cancelled!\n Learn more about it at: ${args.paymentIntentLink}`,
    html:
      `<p>A Subsciption has been cancelled. Learn more about it <a ${args.paymentIntentLink} target="_blank">here</a></p>`,
  };
};

export const SubsciptionCancelledCustomer = (
  args: SubsciptionArgs,
): EmailContent => {
  return {
    content:
      `You have cancelled a subsciption! You can find the details at ${args.paymentIntentLink}`,
    html:
      `<p>You have cancelled a subsciption! You can find more details at the <a href="${args.paymentIntentLink}" target="_blank">link here</a></p>`,
  };
};

