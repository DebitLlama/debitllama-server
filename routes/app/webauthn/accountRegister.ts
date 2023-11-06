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

    // Check if authenticator exists already and if it does then don't insert and return the credentialID
    try {
      await insertNewAccountAuthenticator(ctx, {
        authenticator: newAuthenticator,
      });
      // If the insert succeeds then this is a new insert and the authenticator was not registered yet
      return new Response(
        JSON.stringify({
          success: verified[1].verified,
          credentialID: encodeUint8ArrayToBase64(credentialID),
          alreadyRegistered: false,
        }),
        {
          status: 200,
        },
      );
    } catch (err) {
      // if the insert fails then then the authenticator was probably registered already
      return new Response(
        JSON.stringify({
          error: verified[1],
          message: "Error inserting failed! Account already exists!",
        }),
        {
          status: 400,
        },
      );
    }
  },
  async GET(_req, ctx) {
    const options = await registerAuthenticatorGETForAccount(
      ctx,
      ctx.state.userid as string,
    );
    return new Response(JSON.stringify(options), { status: 200 });
  },
};
