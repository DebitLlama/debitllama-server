import { EMAILCONSTANTS } from "../enums.ts";
import { sendMail } from "./mailer.ts";
import {
  newSubscriptionAcceptedCustomer,
  newSubscriptionAcceptedMerchant,
  passwordResetTemplate,
  verifyEmailTemplates,
} from "./templates/templates.ts";

export async function doSendVerifyEmailMessage(
  toEmail: string,
  verifyUrl: string,
) {
  try {
    const url = EMAILCONSTANTS.verifyEmailUrlBase + verifyUrl;
    const templates = verifyEmailTemplates({
      emailAddress: toEmail,
      verifyUrl: url,
    });

    await sendMail({
      from: EMAILCONSTANTS.noreply,
      to: toEmail,
      subject: EMAILCONSTANTS.verifyEmailSubject,
      content: templates.content,
      html: templates.html,
    });
    return true;
  } catch (_err) {
    return false;
  }
}

export async function doSendPasswordResetEmailMessage(
  toEmail: string,
  q: string,
) {
  try {
    const url = EMAILCONSTANTS.passwordResetUrlBase + q;
    const templates = passwordResetTemplate({
      emailAddress: toEmail,
      resetUrl: url,
    });
    await sendMail({
      from: EMAILCONSTANTS.noreply,
      to: toEmail,
      subject: EMAILCONSTANTS.passwordResetSubject,
      content: templates.content,
      html: templates.html,
    });
    return true;
  } catch (_err) {
    return false;
  }
}

export async function sendPaymentIntentCreatedEmail(
  toCustomerEmail: string,
  toMerchantEmail: string,
  q: string,
) {
  try {
    const createdUrl = EMAILCONSTANTS.createdPaymentIntents + q;
    const payeeUrl = EMAILCONSTANTS.payeePaymentIntents + q;

    const customerTemplates = newSubscriptionAcceptedCustomer({
      paymentIntentLink: createdUrl,
      emailAddress: toCustomerEmail,
    });

    const merchantTemplates = newSubscriptionAcceptedMerchant({
      paymentIntentLink: payeeUrl,
      emailAddress: toMerchantEmail,
    });

    await sendMail({
      from: EMAILCONSTANTS.noreply,
      to: toCustomerEmail,
      subject: EMAILCONSTANTS.newSubscription,
      content: customerTemplates.content,
      html: customerTemplates.html,
    });

    await sendMail({
      from: EMAILCONSTANTS.noreply,
      to: toMerchantEmail,
      subject: EMAILCONSTANTS.newSubscription,
      content: merchantTemplates.content,
      html: merchantTemplates.html,
    });
  } catch (err) {
    return false;
  }
}
