// Api endpoints for the pagination API
import { Handlers } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import { authenticationVerifyGET } from "../../../lib/backend/businessLogic.ts";

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
};
