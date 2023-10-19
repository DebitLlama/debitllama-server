import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    console.log(ctx.params);

    // Get the Relayer Balance details

    return new Response("Hello from index.ts", { status: 200 });
  },
};
