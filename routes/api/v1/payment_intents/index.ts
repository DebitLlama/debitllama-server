import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    console.log(ctx.params);

    // Get all payment intents for access token owner

    return new Response("Hello from index.ts", { status: 200 });
  },
};
