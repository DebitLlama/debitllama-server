import { Authenticator } from "../../../webauthn/backend.ts";
import { responseHandler, unwrapContext } from "../utils.ts";

export async function selectAllAccountAuthenticatorsByUserId(
  ctx: any,
  args: {},
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("account_authenticators")
    .select()
    .eq("user_id", userid);

  return responseHandler(res, {
    rpc: "selectAllAccountAuthenticatorsByUserId",
    args: { ...args, userid },
  });
}

export async function selectAccountAuthenticatorByCredentialId(ctx: any, args: {
  credentialID: string;
}) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("account_authenticators")
    .select()
    .eq("user_id", userid)
    .eq("credentialID", args.credentialID);

  return responseHandler(res, {
    rpc: "selectAccountAuthenticatorByCredentialId",
    args: { ...args, userid },
  });
}

export async function insertNewAccountAuthenticator(
  ctx: any,
  args: {
    authenticator: Authenticator;
  },
) {
  const { client, userid } = unwrapContext(ctx);
  const {
    credentialID,
    credentialPublicKey,
    counter,
    credentialDeviceType,
    credentialBackedUp,
    transports,
  } = args.authenticator;
  const res = await client.from("account_authenticators")
    .insert({
      created_at: new Date().toUTCString(),
      user_id: userid,
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: JSON.stringify(transports),
    });

  return responseHandler(res, {
    rpc: "insertNewAccountAuthenticator",
    args: { ...args, userid },
  });
}

export async function deleteAccountAuthenticatorByCredentialIdForUser(
  ctx: any,
  args: {
    credentialID: string;
  },
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("AccountAuthenticators")
    .delete()
    .eq("credentialID", args.credentialID)
    .eq("user_id", userid);

  return responseHandler(res, {
    rpc: "deleteAuthenticatorByCredentialIdForUser",
    args: { ...args, userid },
  });
}
