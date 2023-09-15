// deno-lint-ignore-file no-explicit-any

import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { ChainIds, getConnectedWalletsContractAddress, getVirtualAccountsContractAddress, networkNameFromId } from "../../lib/shared/web3.ts";
import { getAccount } from "../../lib/backend/web3.ts";
import { ZeroAddress, formatEther } from "../../ethers.min.js";
import AccountTopupOrClose from "../../islands/AccountTopupOrClose.tsx";
import { AccountCardElement } from "../../components/AccountCardElement.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { updatePaymentIntentsWhereAccountBalanceWasAdded } from "../../lib/backend/businessLogic.ts";
import { AccountTypes } from "../../lib/enums.ts";
import WalletApproveOrDisconnect from "../../islands/WalletApproveOrDisconnect.tsx";
import WalletDetailsFetcher from "../../islands/WalletDetailsFetcher.tsx";

export const handler: Handlers<any, State> = {
    async GET(req: any, ctx: any) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        try {
            const { data } = await select.Accounts.byCommitment(query);

            if (data.length === 0) {
                return ctx.render({ ...ctx.state, notfound: true })
            }

            const networkId = data[0].network_id;

            const onChainAccount = await getAccount(query, networkId, data[0].accountType);

            // I only do this for Virtual accounts, only those have balance!
            if (data[0].balance !== formatEther(onChainAccount.account[3])
                && data[0].accountType === AccountTypes.VIRTUALACCOUNT) {
                const update = queryBuilder.update();

                //Check if there were payment intents with account balance too low and 
                // calculate how much balance was added and set them to recurring or created where possible
                await updatePaymentIntentsWhereAccountBalanceWasAdded(queryBuilder, data[0], onChainAccount.account[3]);

                // Update the account balance finally

                await update.Accounts.balanceAndClosedById(onChainAccount.account[3], !onChainAccount.account[0], data[0].id)

            }

            if (data[0].closed) {
                // If it's closed I redirect to accounts page!
                const headers = new Headers();
                headers.set("location", "/app/accounts");
                return new Response(null, {
                    status: 303,
                    headers,
                });
            }
            return ctx.render(
                {
                    notfound: false,
                    ...ctx.state,
                    currency: data[0].currency,
                    name: data[0].name,
                    commitment: query,
                    closed: data[0].closed,
                    networkId: networkId,
                    accountData: onChainAccount,
                    accountType: data[0].accountType
                });

        } catch (err) {
            return new Response(null, { status: 500 })
        }
    }
}
export default function Account(props: PageProps) {
    const balance = props.data.accountData.account[3];
    const tokenAddress = props.data.accountData.account[2];
    const creatorAddress = props.data.accountData.account[1];
    const accountType = props.data.accountType;
    return <Layout isLoggedIn={props.data.token}>
        {!props.data.notfound ?
            <div class="container mx-auto py-8">
                <div class="flex items-center justify-center h-full">
                    <div class="bg-white shadow-2xl p-6 rounded-2xl border-2 border-gray-50">
                        <div class="flex flex-col justify-center">
                            <AccountCardElement
                                name={props.data.name}
                                balance={formatEther(balance)}
                                network={networkNameFromId[props.data.networkId as ChainIds]}
                                currency={props.data.currency}
                                accountType={accountType}
                                closed={props.data.closed}
                            ></AccountCardElement>
                            <WalletDetailsFetcher
                                accountType={accountType}
                                networkId={props.data.networkId}
                                creatorAddress={creatorAddress}
                                tokenAddress={tokenAddress}
                                currencyName={JSON.parse(props.data.currency).name}
                                updateBalance={(to: string) => {
                                    //Do nothing here now,
                                }}
                            ></WalletDetailsFetcher>
                            {accountType === AccountTypes.VIRTUALACCOUNT ?
                                <AccountTopupOrClose
                                    currencyName={props.data.currency}
                                    accountName={props.data.name}
                                    debitContractAddress={getVirtualAccountsContractAddress[props.data.networkId as ChainIds]}
                                    erc20ContractAddress={tokenAddress}
                                    commitment={props.data.commitment}
                                    chainId={props.data.networkId}
                                    isERC20={tokenAddress !== ZeroAddress}
                                    accountClosed={props.data.closed}
                                ></AccountTopupOrClose>
                                : <WalletApproveOrDisconnect
                                    chainId={props.data.networkId}
                                    erc20ContractAddress={tokenAddress}
                                    debitContractAddress={getConnectedWalletsContractAddress[props.data.networkId as ChainIds]}
                                    accountClosed={props.data.closed}
                                    commitment={props.data.commitment}
                                ></WalletApproveOrDisconnect>
                            }
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