import { ContentArgs, EmailContent } from "../types.ts";

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

// export async function doSendVerifyEmailMessage(
//   toEmail: string,
//   verifyUrl: string,
// ) {
//   try {
//     const url = EMAILCONSTANTS.verifyEmailUrlBase + verifyUrl;
//     const templates = verifyEmailTemplates({
//       emailAddress: toEmail,
//       verifyUrl: url,
//     });

//     await sendMail({
//       from: EMAILCONSTANTS.noreply,
//       to: toEmail,
//       subject: EMAILCONSTANTS.verifyEmailSubject,
//       content: templates.content,
//       html: templates.html,
//     });
//     return true;
//   } catch (_err) {
//     return false;
//   }
// }

// export async function doSendPasswordResetEmailMessage(
//   toEmail: string,
//   q: string,
// ) {
//   try {
//     const url = EMAILCONSTANTS.passwordResetUrlBase + q;
//     const templates = passwordResetTemplate({
//       emailAddress: toEmail,
//       resetUrl: url,
//     });
//     await sendMail({
//       from: EMAILCONSTANTS.noreply,
//       to: toEmail,
//       subject: EMAILCONSTANTS.passwordResetSubject,
//       content: templates.content,
//       html: templates.html,
//     });
//     return true;
//   } catch (_err) {
//     return false;
//   }
// }
