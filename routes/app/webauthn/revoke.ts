// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";

import QueryBuilder from "../../../lib/backend/db/queryBuilder.ts";
import { State } from "../../_middleware.ts";
import { authenticationVerifyGET } from "../../../lib/backend/businessLogic.ts";
import { verifyAuthentication } from "../../../lib/webauthn/backend.ts";
import {
  deleteAuthenticatorByCredentialIdForUser,
  selectAllAuthenticatorsByCredentialId,
} from "../../../lib/backend/db/tables/Authenticators.ts";

export const handler: Handlers<any, State> = {
  async POST(_req, ctx) {
    const json = await _req.json();
    const queryBuilder = new QueryBuilder(ctx);
    const select = queryBuilder.select();
    const { data: userChallenge } = await select.UserChallenges
      .currentChallenge();

    const { data: authenticators } =
      await selectAllAuthenticatorsByCredentialId(ctx, {
        credentialID: json.id,
      });

    if (authenticators.length === 0) {
      return new Response(
        JSON.stringify({ error: "Unable to find authenticator." }),
        { status: 400 },
      );
    }

    const [success, verification] = await verifyAuthentication(
      json,
      userChallenge[0],
      authenticators[0],
    );

    if (!success) {
      return new Response(JSON.stringify({ error: verification }), {
        status: 400,
      });
    }

    // Now I delete the authenticator since it was verified!!
    await deleteAuthenticatorByCredentialIdForUser(ctx, {
      credentialID: json.id,
    });

    return new Response(
      JSON.stringify({ success: verification.verified }),
      { status: 200 },
    );
  },
  async GET(_req, ctx) {
    const queryBuilder = new QueryBuilder(ctx);
    const [success, options] = await authenticationVerifyGET(
      ctx,
      queryBuilder,
    );

    if (!success) {
      return new Response(
        JSON.stringify({ error: "You have no passkeys added!" }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify(options), { status: 200 });
  },
};
