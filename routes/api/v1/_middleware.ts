import { MiddlewareHandlerContext } from "$fresh/server.ts";
import {
  v1Error,
  V1ErrorResponseBuilder,
} from "../../../lib/api_v1/responseBuilders.ts";
import {
  AccessTokensQuery,
  getAuthTokenFromHeader,
  tokenExpired,
} from "../../../lib/backend/db/auth.ts";

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const origin = _req.headers.get("Origin") || "*";

  // Handle CORS for OPTINS requests! Exclude user credentials on pre flight requests.
  if (_req.method == "OPTIONS") {
    const resp = new Response(null, {
      status: 204,
    });
    const headers = resp.headers;
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "DELETE");
    return resp;
  }

  let resp;
  // If the request is not GET, then I Authenticate the endpoint!
  if (_req.method !== "GET") {
    const authorization = _req.headers.get("Authorization");
    if (authorization === null) {
      resp = v1Error(
        V1ErrorResponseBuilder({
          message: "Missing Authorization Header",
          status: 401,
          timestamp: new Date().toUTCString(),
        }),
        401,
      );
    } else {
      try {
        const accesstoken = getAuthTokenFromHeader(authorization);

        const tokenres = await AccessTokensQuery(
          ctx.state.supabaseClient,
          accesstoken,
        );
        // Throw an error if the token expired
        tokenExpired(tokenres.data[0]);
        ctx.state.userid = tokenres.data[0].creator_id;
        // Check if the token is still valid and if yes then stash the creator_id in state as user_id!
        resp = await ctx.next();
      } catch (err: any) {
        // If the access token can't be parsed, I return errorz
        resp = v1Error(
          V1ErrorResponseBuilder({
            message: err.message,
            status: 401,
            timestamp: new Date().toUTCString(),
          }),
          401,
        );
      }
    }
  } else {
    resp = await ctx.next();
  }

  //TODO: I need to write a rate limiter that stores
  // IP addresses in memory and doesn't allow too many requests per IP per minute!

  // Add the CORS headers to the response
  const headers = resp.headers;

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
  );
  headers.set(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, GET, PUT, DELETE",
  );

  // All endpoints return JSON!
  headers.set("Content-Type", "application/json");

  return resp;
}
