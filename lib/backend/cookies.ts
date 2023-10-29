import { deleteCookie, setCookie } from "$std/http/cookie.ts";
import { CookieNames } from "../enums.ts";

export function setProfileRedirectCookie(headers: Headers, value: string) {
  setCookie(headers, {
    name: CookieNames.profileRedirect,
    value: value,
    maxAge: 600, // Expires in 10 minutes
  });
}

export function deleteProfileRedirectCookie(headers: Headers) {
  deleteCookie(headers, CookieNames.profileRedirect);
}

export function setSupaloginCookie(
  headers: Headers,
  value: string,
  maxAge: number,
) {
  setCookie(headers, {
    name: CookieNames.supaLogin,
    value,
    maxAge,
  });
}

export function setRenderSidebarOpen(
  headers: Headers,
  value: string,
  maxAge: number,
) {
  setCookie(headers, {
    name: CookieNames.renderSidebarOpen,
    value,
    maxAge,
  });
}

export function setLoginRedirect(headers: Headers, url: URL) {
  setCookie(headers, {
    name: CookieNames.loginRedirect,
    value: url.pathname.includes("/app/post")
      // If my last request was a post for some reason then I don't want to set the cookie at all
      ? "/app/accounts"
      : url.pathname + url.search,
    maxAge: 600, // 10 minutes max,
    path: "/",
  });
}
