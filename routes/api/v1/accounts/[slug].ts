import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    const { slug } = ctx.params;
    console.log(ctx.params);

    //Get account by id! it should fetch the balance from the blockchain also and update it

    return new Response("Hello from accounts/[slug].ts", { status: 200 });
  },
};
