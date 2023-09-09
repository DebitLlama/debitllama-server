import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { getAccount } from "../../lib/backend/web3.ts";
import { ChainIds, rpcUrl } from "../../lib/shared/web3.ts";
import { State } from "../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const commitment = json.commitment;
        const networkId = json.networkId;
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const networkExists = rpcUrl[networkId as ChainIds]
        if (!networkExists) {
            return new Response(null, { status: 500 })
        }
        const accountData = await getAccount(commitment, networkId);
        if (accountData.exists) {
            const { data, error } = await select.Accounts.byCommitment(commitment);
            if (data === null || data.length === 0) {
                return new Response(null, { status: 500 })
            } else {
                const update = queryBuilder.update();
                await update.Accounts.balanceAndClosedById(
                    accountData.account[3],
                    !accountData.account[0],
                    data[0].id);
                return new Response(null, { status: 200 })
            }
        } else {
            return new Response(null, { status: 500 })
        }
    }
}