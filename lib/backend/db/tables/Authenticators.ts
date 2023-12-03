import { Authenticator } from "../../../webauthn/backend.ts";
import { responseHandler, unwrapContext } from "../utils.ts";

export async function selectAllAuthenticatorsByUserId(
  ctx: any,
  args: {},
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("Authenticators")
    .select()
    .eq("user_id", userid);

  return responseHandler(res, {
    rpc: "selectAllAuthenticatorsByUserId",
    args: { ...args, userid },
  });
}

export async function selectAllAuthenticatorsByCredentialId(
  ctx: any,
  args: {
    credentialID: string;
  },
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("Authenticators")
    .select()
    .eq("user_id", userid)
    .eq("credentialID", args.credentialID);

  return responseHandler(res, {
    rpc: "selectAllAuthenticatorsByCredentialId",
    args: { ...args, userid },
  });
}

export async function insertNewAuthenticator(
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
  const res = await client.from("Authenticators")
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
    rpc: "insertNewAuthenticator",
    args: { ...args, userid },
  });
}

export async function deleteAuthenticatorByCredentialIdForUser(
  ctx: any,
  args: {
    credentialID: string;
  },
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("Authenticators")
    .delete()
    .eq("credentialID", args.credentialID)
    .eq("user_id", userid);

  return responseHandler(res, {
    rpc: "deleteAuthenticatorByCredentialIdForUser",
    args: { ...args, userid },
  });
}
