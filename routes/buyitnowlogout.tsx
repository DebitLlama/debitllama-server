import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
export const handler: Handlers = {
    GET(_req, _ctx) {
        const url = new URL(_req.url);
        const query = url.searchParams.get("q") || "";

        const headers = new Headers();
        deleteCookie(headers, "supaLogin");
        headers.set("location", "/buyitnow?q=" + query);
        return new Response(null, {
            status: 303,
            headers,
        });
    }
}