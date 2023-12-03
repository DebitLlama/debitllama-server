// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";

import { State } from "../../_middleware.ts";
import {
  account_AuthenticationLargeBlobRead,
  account_AuthenticationLargeBlobWrite,
  authenticationVerifyGET,
} from "../../../lib/backend/businessLogic.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const [success, options] = await authenticationVerifyGET(
      ctx,
    );

    if (!success) {
      return new Response(
        JSON.stringify({ error: "2FA is not active" }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify(options), { status: 200 });
  },
  async POST(_req, ctx) {
    const url = new URL(_req.url);
    const q = url.searchParams.get("q") || "";

    if (q !== "read" && q !== "write") {
      return new Response(
        JSON.stringify({ error: "Incalid query parmeter" }),
        { status: 400 },
      );
    }

    if (q === "write") {
      const body = await _req.json();
      const credentialID = body.credentialID;

      const [success, options] = await account_AuthenticationLargeBlobWrite(
        ctx,
        credentialID,
      );

      if (!success) {
        return new Response(
          JSON.stringify({ error: "Unable to find authenticator!" }),
          { status: 400 },
        );
      }

      return new Response(JSON.stringify(options), { status: 200 });
    } else {
      const [success, options] = await account_AuthenticationLargeBlobRead(
        ctx,
      );

      if (!success) {
        return new Response(
          JSON.stringify({ error: "Unable to start reading largeblob" }),
          { status: 400 },
        );
      }
      return new Response(JSON.stringify(options), { status: 200 });
    }
  },
};
