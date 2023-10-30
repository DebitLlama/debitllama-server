import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, ctx: HandlerContext) {
    const { slug } = ctx.params;
    console.log(ctx.params);

    // Slug is the button_id, I should rename it to item_id when serving the request!

    //Get item created by the access token owner
    // Get the checkout URL and the embeddable button URL too!
    // THis endpoint lets them fetch the checkout button dynamically!

    return new Response("Hello from slug.ts", { status: 200 });
  },
  POST(_req: Request, ctx: HandlerContext) {
    //TODO: Update an item redirect url or set it to deactivated!
    //TODO: Update an the the email sending
    //TODO: Add a new item dynamically to create user tailored debit items!
    return new Response(null, { status: 200 });
  },
};
