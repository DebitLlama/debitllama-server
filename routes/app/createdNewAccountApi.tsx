import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { getAccount } from "../../lib/backend/web3.ts";
import { ChainIds, rpcUrl } from "../../lib/shared/web3.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        try {
            const json = await _req.json();
            const commitment = json.commitment;
            const networkId = json.networkId;
            const name = json.name;
            const currency = json.currency;
            const networkExists = rpcUrl[networkId as ChainIds];
            const queryBuilder = new QueryBuilder(ctx);
            const select = queryBuilder.select();

            if (!networkExists) {
                return new Response(null, { status: 500 })
            }
            const accountData = await getAccount(commitment, networkId);
            if (accountData.exists) {
                //checking if account is already saved into the database
                const { data, error } = await select.Accounts.byCommitment(commitment);

                //@ts-ignore checking if it returns an empty array
                if (data.length === 0) {
                    const insert = queryBuilder.insert();
                    await insert.Accounts.newAccount(
                        networkId,
                        commitment,
                        name,
                        currency,
                        accountData.account[3]
                    )
                    return new Response(null, { status: 200 })
                } else {
                    //It exists already so I return a 500 because this endpoint is not for topups
                    return new Response(null, { status: 500 })
                }

            } else {
                // The account was not found on chain so I can't add it
                return new Response(null, { status: 500 })
            }
        }
        catch (err: any) {
            console.log(err)
            return new Response(null, { status: 500 })
        }
    }
}