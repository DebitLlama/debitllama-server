export async function POSTUserFeedback(url: string, data: string) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  }).then((response) => response);
}
