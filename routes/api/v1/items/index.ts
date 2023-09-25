import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    console.log(ctx.params);

    // Get all items of the access token owner

    return new Response("Hello from index.ts", { status: 200 });
  },
  PUT(_req: Request, ctx: HandlerContext) {
    //TODO: Create a brand new item
    return new Response(null, { status: 200 });
  },
};
