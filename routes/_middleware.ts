// deno-lint-ignore-file no-explicit-any
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getCookies } from "$std/http/cookie.ts";
import { getUser } from "../lib/backend/db/auth.ts";
import { AuthWhitelist } from "../lib/enums.ts";

export interface State {
  token: string | null;
  userid: string | null;
  supabaseClient: SupabaseClient<any, "public", any>;
  renderSidebarOpen: "true" | "false"; // The server will track if the sidebar should be rendered open or not
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
    { auth: { persistSession: false } },
  );
  const url = new URL(req.url);
  ctx.state.supabaseClient = client;

  if (shouldCheckAuth(url.pathname)) {
    const supaCreds = getCookies(req.headers)["supaLogin"];

    if (!supaCreds) {
      return ctx.next();
    }

    const renderSidebarOpen = getCookies(req.headers)["renderSidebarOpen"] as
      | "true"
      | "false";
    const { error, data: { user } } = await getUser(client, supaCreds);
    if (error) {
      ctx.state.token = null;
    } else {
      ctx.state.token = supaCreds;
      //@ts-ignore user is not null
      ctx.state.userid = user.id;
      ctx.state.renderSidebarOpen = renderSidebarOpen;
    }

    return await ctx.next();
  }

  //I removed the cacheing because it was breaking the islands on first load
  return ctx.next();
}

function shouldCheckAuth(pathname: string) {
  return pathname.startsWith(AuthWhitelist.app) ||
    pathname.startsWith(AuthWhitelist.buyitnow);
}
