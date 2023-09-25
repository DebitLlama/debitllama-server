//The generic fetch function that supports Bearer Authentication

export interface AuthenticatedGETArgs {
  accesstoken: string;
  url: string;
}

export async function AuthenticatedGET(args: AuthenticatedGETArgs) {
  return await fetch(args.url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${args.accesstoken}`,
    },
  }).then((response) => response);
}
