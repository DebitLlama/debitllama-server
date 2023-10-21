import { POSTUserFeedback } from "./fetch.ts";
import { newFeedbackToSlack } from "./templates.ts";

export async function triggerUserFeedbackWebhook(
  args: { subject: string; message: string; fromEmail: string },
) {
  const url = Deno.env.get("USER_FEEDBACKS_WEBHOOK") || "";
  if (url === "") {
    // If the slack is not configured, just return
    return;
  }

  const messageToSend = newFeedbackToSlack(
    args.subject,
    args.message,
    args.fromEmail,
  );
  await POSTUserFeedback(url, messageToSend);
}
