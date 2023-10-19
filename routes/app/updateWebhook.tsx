import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const headers = new Headers();
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const update = queryBuilder.update();
        const insert = queryBuilder.insert();
        const json = await _req.json();
        const webhook_url = json.webhook_url as string;

        const webhooks = await select.Webhooks.byUserId();

        if (webhooks.data.length === 0) {
            await insert.Webhooks.newUrl(webhook_url);
        } else {
            await update.Webhooks.byUserId(webhook_url);
        }
        return new Response(null, { status: 200, headers })
    },
};
