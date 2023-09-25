import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    const { slug } = ctx.params;
    console.log(ctx.params);

    //Get payment intent where access token owner is the payee

    return new Response("Hello from slug.ts", { status: 200 });
  },
  POST(_req: Request, ctx: HandlerContext) {
    //TODO: CAN REQUEST HERE A DYNAMIC PAYMENT IF THE Subsciption allows it!
    return new Response(null, { status: 200 });
  },
};
