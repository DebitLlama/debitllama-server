import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
import { CookieNames } from "../lib/enums.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const headers = new Headers();
    deleteCookie(headers, CookieNames.supaLogin);
    deleteCookie(headers, CookieNames.renderSidebarOpen);
    headers.set("location", "/");
    return new Response(null, {
      status: 303,
      headers,
    });
  }
}