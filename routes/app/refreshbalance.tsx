import { Handlers } from "$fresh/server.ts";
import { updatePaymentIntentsWhereAccountBalanceWasAdded } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { errorResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import { getAccount } from "../../lib/backend/web3.ts";
import { ChainIds, rpcUrl } from "../../lib/shared/web3.ts";
import { State } from "../_middleware.ts";

//This is used to refresh the balance of an already existing account!
// Refresh balance always updates the database!
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
        const { data } = await select.Accounts.byCommitment(commitment);

        if (data === null || data.length === 0) {
            return errorResponseBuilder("Account not found")
        }

        if (data[0].closed) {
            return errorResponseBuilder("Account closed");
        }

        const onChainAccount = await getAccount(commitment, networkId, data[0].accountType);

        if (onChainAccount.exists) {
            const update = queryBuilder.update();
            //TODO: THESE COULD BE 1 RPC CALL
            //Check if there were payment intents with account balance too low and 
            // calculate how much balance was added and set them to recurring or created where possible
            await updatePaymentIntentsWhereAccountBalanceWasAdded(queryBuilder, onChainAccount.account[3], data[0].id);

            await update.Accounts.balanceAndClosedById(
                onChainAccount.account[3],
                !onChainAccount.account[0],
                data[0].id);

            return new Response(null, { status: 200 })
        } else {

            return new Response(null, { status: 500 })
        }
    }
}