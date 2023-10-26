import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { State } from "../_middleware.ts";

// Update the item url by button_id and user_id

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const headers = new Headers();
        const queryBuilder = new QueryBuilder(ctx);
        const update = queryBuilder.update();
        const form = await _req.formData();
        const button_id = form.get("button_id") as string;
        const redirect_url = form.get("redirect_url") as string;

        // I update by redirect url and button id and then return a redirect!
        // If the logged in user_id don't have the button_id, the update fails
        // But I still just return ar edirect as nothing happens.

        await update.Items.updateRedirectUrlForItem(button_id, redirect_url);

        headers.set("location", `/app/item?q=${button_id}`);

        return new Response(null, { status: 303, headers })

    },
};
