import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { setLoginRedirect } from "../../lib/backend/cookies.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { CookieNames } from "../../lib/enums.ts";

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const headers = new Headers();
  const url = new URL(_req.url);

  if (!ctx.state.token) {
    headers.set("location", "/");
    setLoginRedirect(headers, url);

    return new Response(null, {
      status: 303,
      headers,
    });
  }
  const profileRedirect = getCookies(_req.headers)[CookieNames.profileRedirect];
  // I delete the profile redirect cookie here if the page is not profile and the cookie is not undefined
  const resp = await ctx.next();

  if (url.pathname !== "/app/profile" && profileRedirect) {
    // I only need the cookie when I redirect to profile page!
    // When the post on that page is triggered, it can redirect back to the page that redirected to it!
    // But really I put this here so the redirect is removed if the user navigates away from the profile page without filling it out!
    deleteCookie(resp.headers, CookieNames.profileRedirect);
  }

  return resp;
}
