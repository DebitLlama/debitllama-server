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

export async function UnAuthenticatedGET(url: string) {
  return await fetch(url, {
    method: "GET",
  }).then((response) => response);
}

export interface AuthenticatedPOSTArgs {
  accesstoken: string;
  url: string;
  body: string;
}

export async function AuthenticatedPOST(args: AuthenticatedPOSTArgs) {
  return await fetch(args.url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${args.accesstoken}`,
      "Content-Type": "application/json",
    },
    body: args.body,
  }).then((response) => response);
}
