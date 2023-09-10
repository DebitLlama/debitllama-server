// deno-lint-ignore-file no-explicit-any

import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { ChainIds, getDirectDebitContractAddress, networkNameFromId, rpcUrl } from "../../lib/shared/web3.ts";
import { getAccount } from "../../lib/backend/web3.ts";
import { ZeroAddress, formatEther } from "../../ethers.min.js";
import AccountTopupOrClose from "../../islands/AccountTopupOrClose.tsx";
import { AccountCardElement } from "../../components/AccountCardElement.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { updatePaymentIntentsWhereAccountBalanceWasAdded } from "../../lib/backend/businessLogic.ts";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        try {
            const { networkId, commitment, name, currency } = JSON.parse(query);

            const networkExists = rpcUrl[networkId as ChainIds]
            if (!networkExists) {
                //   render a not found page
                return ctx.render({ ...ctx.state, notfound: true })
            }
            const accountData = await getAccount(commitment, networkId);
            if (accountData.exists) {
                const { data } = await select.Accounts.byCommitment(commitment);

                if (data.length === 0) {
                    const insert = queryBuilder.insert();

                    await insert.Accounts.newAccount(
                        networkId,
                        commitment,
                        name,
                        currency,
                        accountData.account[3]
                    )
                    // Here I return the data from the query string because that is what was saved!
                    return ctx.render({ notfound: false, ...ctx.state, currency, name, commitment, closed: false, networkId, accountData });
                } else {

                    if (data[0].balance !== formatEther(accountData.account[3])) {
                        const update = queryBuilder.update();
                        //Check if there were payment intents with account balance too low and 
                        // calculate how much balance was added and set them to recurring or created where possible
                        await updatePaymentIntentsWhereAccountBalanceWasAdded(queryBuilder, data[0], accountData.account[3]);

                        // Update the account balance finally
                        await update.Accounts.balanceAndClosedById(accountData.account[3], !accountData.account[0], data[0].id)
                    }

                    // Here I return the data from the database because the account was saved
                    return ctx.render({ notfound: false, ...ctx.state, currency, name, commitment, closed: data[0].closed, networkId: networkId, accountData });
                }

            } else {
                // render a context not found page
                return ctx.render({ ...ctx.state, notfound: true })
            }

        } catch (err) {
            return new Response(null, { status: 500 })
        }
    }
}

export default function Account(props: PageProps) {
    const balance = props.data.accountData.account[3];
    const tokenAddress = props.data.accountData.account[2];
    return <Layout isLoggedIn={props.data.token}>
        {!props.data.notfound ?
            <div class="container mx-auto py-8">
                <div class="flex items-center justify-center h-full">
                    <div class="bg-white shadow-2xl p-6 rounded-2xl border-2 border-gray-50 w-96">
                        <div class="flex flex-col">
                            <AccountCardElement
                                name={props.data.name}
                                balance={formatEther(balance)}
                                network={networkNameFromId[props.data.networkId as ChainIds]}
                                currency={props.data.currency}
                            ></AccountCardElement>
                            <AccountTopupOrClose
                                currencyName={props.data.currency}
                                accountName={props.data.name}
                                debitContractAddress={getDirectDebitContractAddress[props.data.networkId as ChainIds]}
                                erc20ContractAddress={tokenAddress}
                                commitment={props.data.commitment}
                                chainId={props.data.networkId}
                                isERC20={tokenAddress !== ZeroAddress}
                                accountClosed={props.data.closed}
                            ></AccountTopupOrClose>
                        </div>
                    </div>
                </div>
            </div>
            : <div class="container mx-auto py-8">
                <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                    <h1 class="text-2xl font-bold mb-6 text-center">Account Not Found</h1>
                </div>
            </div>
        }
    </Layout>
}