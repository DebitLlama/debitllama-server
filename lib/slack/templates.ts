export const newFeedbackToSlack = (
  subject: string,
  message: string,
  senderEmailAddress: string,
) => {
  return JSON.stringify({
    text:
      `A new message from ${senderEmailAddress}\nSubject: ${subject}\n${message}\n`,
  });
};
