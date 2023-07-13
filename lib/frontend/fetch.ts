export async function saveAccountData(
  networkId: string,
  commitment: string,
  name: string,
): Promise<number> {
  return await fetch("/app/addNewAccount", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({ networkId, commitment, name }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.status);
}

export function redirectToAccountPage(
  networkId: string,
  commitment: string,
  name: string,
) {
  const params = JSON.stringify({ networkId, commitment, name });
  window.location.href = `/app/account?q=${params}`;
}
