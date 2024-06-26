import { AccessTokenRow } from "../../enums.ts";

//AUTH
export async function signUp(
  supabaseClient: any,
  email: string,
  password: string,
) {
  return await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://debitllama.com/emailVerified",
    },
  });
}

export async function signInWithPassword(
  supabaseClient: any,
  email: string,
  password: string,
) {
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

export type SignupProvider = "google";

export async function signInWithOAuth(
  supabaseClient: any,
  provider: SignupProvider,
) {
  return await supabaseClient.auth.signInWithOAuth({
    provider: provider,
  });
}

export async function resendEmailConfirmation(
  supabaseClient: any,
  email: string,
) {
  return await supabaseClient.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: "https://debitllama.com/emailVerified" },
  });
}

export async function sendPasswordResetEmail(
  supabaseClient: any,
  email: string,
) {
  return await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://debitllama.com/app/updatepassword",
  });
}

export async function updateUserPassword(
  supabaseClient: any,
  newpassword: string,
) {
  return await supabaseClient.auth.updateUser({ password: newpassword });
}

export async function getUser(
  supabaseClient: any,
  supaCreds: string,
): Promise<{ error: any; data: { user: any } }> {
  return await supabaseClient.auth.getUser(supaCreds);
}

export const rand = () => {
  return Math.random().toString(36).slice(2);
};

export function generateApiAuthToken() {
  const token = () => {
    return "debitllama.APIv1_" + rand() + rand() + rand();
  };

  return token();
}

// The value should be "Bearer accesstoken", so we extract the token from there
export function getAuthTokenFromHeader(headerValue: string) {
  const bearer = headerValue.slice(0, 7);
  if (bearer !== "Bearer ") {
    throw Error("Invalid Authorization Value");
  }
  const accessToken = headerValue.slice(7);
  if (!accessToken.startsWith("debitllama.APIv1_")) {
    throw Error("Invalid Token Format");
  }
  return accessToken;
}

//This is a query to get the creator id of the access token owner!
// So I can add it to ctx and use the query builder like usual!
export async function AccessTokensQuery(client: any, accesstoken: string) {
  return await client.from("ApiAuthTokens")
    .select("*")
    .eq("access_token", accesstoken);
}

export function tokenExpired(accesstokenRow: AccessTokenRow) {
  const expiryDate = new Date(accesstokenRow.expiry_date_utc);
  const now = new Date();

  //If the expiry date is in the future, the token is still valid, yeah!
  if (expiryDate < now) {
    throw new Error("Access Token Expired");
  }
}
