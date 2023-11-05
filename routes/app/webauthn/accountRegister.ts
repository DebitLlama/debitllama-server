// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import {
  registerAuthenticatorGETForAccount,
} from "../../../lib/backend/businessLogic.ts";
import {
  Authenticator,
  encodeUint8ArrayToBase64,
  verifyRegistration,
} from "../../../lib/webauthn/backend.ts";
import { insertNewAccountAuthenticator } from "../../../lib/backend/db/tables/AccountAuthenticators.ts";
import { selectCurrentUserChallenge } from "../../../lib/backend/db/tables/UserChallenges.ts";

export const handler: Handlers<any, State> = {
  async POST(_req, ctx) {
    const json = await _req.json();
    const { data: userChallenge } = await selectCurrentUserChallenge(ctx, {});

    const verified = await verifyRegistration(json, userChallenge[0]);

    if (!verified[0]) {
      return new Response(JSON.stringify({ error: verified[1] }), {
        status: 400,
      });
    }
    const { registrationInfo } = verified[1];
    const { credentialPublicKey, credentialID, counter, credentialDeviceType } =
      registrationInfo;

    const newAuthenticator: Authenticator = {
      credentialID: encodeUint8ArrayToBase64(credentialID),
      credentialPublicKey: encodeUint8ArrayToBase64(credentialPublicKey),
      counter,
      credentialDeviceType,
      credentialBackedUp: true,
      transports: json.response.transports,
    };
    await insertNewAccountAuthenticator(ctx, {
      authenticator: newAuthenticator,
    });

    return new Response(JSON.stringify({ success: verified[1].verified }), {
      status: 200,
    });
  },
  async GET(_req, ctx) {
    const options = await registerAuthenticatorGETForAccount(
      ctx,
      ctx.state.userid as string,
    );

    return new Response(JSON.stringify(options), { status: 200 });
  },
};
