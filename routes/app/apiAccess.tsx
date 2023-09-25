// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import AccessTokenUISwitcher from "../../islands/AccessTokenUISwitcher.tsx";
import { generateApiAuthToken } from "../../lib/backend/auth.ts";
import { getTotalPages } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import { ApiAccessErrors, TokenExpiry, monthsToDate } from "../../lib/enums.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(req, ctx) {
        const form = await req.formData();
        const expiry = form.get("expiry") as string;

        const calculatedExpiryDate = monthsToDate[expiry as TokenExpiry];

        if (calculatedExpiryDate === undefined) {
            return errorResponseBuilder(ApiAccessErrors.InvalidExpiryDate)
        }

        const queryBuilder = new QueryBuilder(ctx);

        const insert = queryBuilder.insert();
        const accessToken = generateApiAuthToken();
        await insert.ApiAuthTokens.newToken(
            accessToken,
            calculatedExpiryDate()
        ).catch((err) => {
            // If the access_token is not unique for some reason, or the insert fails I have an error here
        })

        const select = queryBuilder.select();
        const { data: accesstokens, error, count } = await select.ApiAuthTokens.byUseridPaginated(
            "created_at",
            false,
            0,
            9
        );

        const totalPages = getTotalPages(count, 10);

        const { data: webhookdata, error: WebhooksErr } = await select.Webhooks.byUserId();

        const webhook_url = webhookdata.length === 0 ? "" : webhookdata[0].webhook_url;

        return ctx.render({ ...ctx.state, accesstokens, totalPages, webhook_url })
    },

    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const { data: accesstokens, error, count } = await select.ApiAuthTokens.byUseridPaginated(
            "created_at",
            false,
            0,
            9
        );

        const totalPages = getTotalPages(count, 10);

        const { data: webhookdata, error: WebhooksErr } = await select.Webhooks.byUserId();

        const webhook_url = webhookdata.length === 0 ? "" : webhookdata[0].webhook_url;

        return ctx.render({ ...ctx.state, accesstokens, totalPages, webhook_url })
    },
    async DELETE(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const deleteQ = queryBuilder.delete();
        const json = await _req.json();
        const accesstoken = json.accesstoken as string;

        await deleteQ.ApiAuthTokens.ByAccessToken(accesstoken);

        return successResponseBuilder("ok");
    }
}

export default function ApiAccess(props: PageProps) {
    return <Layout renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <AccessTokenUISwitcher data={props.data}></AccessTokenUISwitcher>
    </Layout>
}
