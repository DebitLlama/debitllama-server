import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    // Return the Zapier Perform List must return an array, I dunno what goes here yet!

    return new Response(JSON.stringify([]), { status: 200 });
  },
};
