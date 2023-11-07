// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../../components/Layout.tsx";
import { generateApiAuthToken } from "../../../lib/backend/db/auth.ts";
import { getTotalPages } from "../../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../../lib/backend/db/queryBuilder.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../../lib/backend/responseBuilders.ts";
import { ApiAccessErrors, DocsLinks, TokenExpiry, monthsToDate } from "../../../lib/enums.ts";
import { State } from "../../_middleware.ts";
import AccessTokensTable from "../../../islands/pagination/AccessTokensTable.tsx";
import { AccessTokenUIState, UiSwitcherButtons } from "../../../components/APiUi.tsx";
import { insertNewAccessToken, selectApiAuthTokensByUseridPaginated } from "../../../lib/backend/db/tables/ApiAuthTokens.ts";

export const handler: Handlers<any, State> = {
    async POST(req, ctx) {
        const headers = new Headers();
        const form = await req.formData();
        const expiry = form.get("expiry") as string;
        const calculatedExpiryDate = monthsToDate[expiry as TokenExpiry];
        if (calculatedExpiryDate === undefined) {
            return errorResponseBuilder(ApiAccessErrors.InvalidExpiryDate)
        }
        const access_token = generateApiAuthToken();
        const { data } = await insertNewAccessToken(ctx, {
            access_token, expiryDate: calculatedExpiryDate()
        })
        // Add the id of the latest access token as a query parameter so I can highlight it on the UI
        headers.set("location", `/app/manage_api/rest?new=${data[0].id}`);

        return new Response(null, {
            status: 303,
            headers
        })
    },

    async GET(_req, ctx) {
        const { data: accesstokens, count } = await selectApiAuthTokensByUseridPaginated(ctx, {
            order: "created_at",
            ascending: false,
            rangeFrom: 0,
            rangeTo: 9
        }
        );
        const totalPages = getTotalPages(count, 10);
        return ctx.render({ ...ctx.state, accesstokens, totalPages })
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
    const newid = props.url.searchParams.get("new");

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="container mx-auto py-8">
            <div class={"flex flex-row justify-end"}>
                <UiSwitcherButtons navigateTo={AccessTokenUIState.ACCESSTOKENS} disabled={true} text="Api Access"></UiSwitcherButtons>
                <UiSwitcherButtons navigateTo={AccessTokenUIState.WEBHOOKCONFIG} disabled={false} text="Webhooks"></UiSwitcherButtons>
            </div>
            <div >
                <div class="mt-10 px-4 mx-auto flex container flex-col justify-center border bg-gradient-to-r from-white via-gray-100 to-white">
                    <div class="text-center mt-5">
                        <p class="text-xl">Generate an access token for the REST API</p>
                    </div>

                    <form action="/app/manage_api/rest" method="POST" class="mb-4 w-full flex flex-row flex-wrap gap-2 justify-evenly">
                        <div >
                            <label class="block text-gray-700 text-sm font-bold mb-2 w-64" for="expiry">Expiry:</label>
                            <select name="expiry" class="w-full h-9 rounded-lg w-64 scale-125 cursor-pointer hover:bg-gray-200" id="expiry">
                                <option value={TokenExpiry.ONEMONTH} >One Month</option>
                                <option value={TokenExpiry.SIXMONTHS} >Six Months</option>
                                <option value={TokenExpiry.ONEYEAR} >One Year</option>
                            </select>
                        </div>
                        <button aria-label="get new access token" type="submit" class=" w-64 mt-2 w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        >Get New Token</button>
                    </form>
                    <div class="text-center">
                        <p class="text-lg">Learn more about how to use the Api from the <a class="text-indigo-800" href={DocsLinks.APIDOCS} target="_blank">documentation</a>!</p>
                    </div>
                    <section class="mt-10 mx-auto container">
                        {props.data.accesstokens.length === 0
                            ? <div>No access tokens</div>
                            : <AccessTokensTable
                                accesstokens={props.data.accesstokens}
                                totalPages={props.data.totalPages}
                                toHighlightId={`${newid}`}
                            ></AccessTokensTable>}
                    </section>
                </div>


            </div>
        </div>
    </Layout>
}
