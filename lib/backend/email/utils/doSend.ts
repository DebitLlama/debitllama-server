import { sendMail } from "./mailer.ts";
import { getEmailContent, getEmailSubject } from "../templates/templates.ts";
import { EMAILCONSTANTS, EmailType, PaymentStatementArgs } from "../types.ts";

/**
 * Send the payment intent state update mail to the Merchant or customer
 * @param reason the reason why we are sending this email
 * @param args the arguments of the email sending statement
 * @param emailTo
 */

export async function doSendMail(
  reason: EmailType,
  args: PaymentStatementArgs,
  emailTo: string,
) {
  const { content, html } = getEmailContent(reason, args);
  const subject = getEmailSubject[reason];
  await sendMail({
    from: EMAILCONSTANTS.noreply,
    to: emailTo,
    subject,
    content,
    html,
  });
}
