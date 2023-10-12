import { EMAILCONSTANTS } from "../enums.ts";
import { sendMail } from "./mailer.ts";
import {
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
