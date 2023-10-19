// deno-lint-ignore-file no-explicit-any

import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { ChainIds, getConnectedWalletsContractAddress, getVirtualAccountsContractAddress, networkNameFromId } from "../../lib/shared/web3.ts";
import AccountTopupOrClose from "../../islands/AccountTopupOrClose.tsx";
import { AccountCardElement } from "../../components/AccountCardElement.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { refreshDBBalance } from "../../lib/backend/businessLogic.ts";
import { AccountTypes, Pricing } from "../../lib/enums.ts";
import WalletApproveOrDisconnect from "../../islands/WalletApproveOrDisconnect.tsx";
import WalletDetailsFetcher from "../../islands/WalletDetailsFetcher.tsx";
import { formatEther } from "../../lib/backend/web3.ts";
import { parseEther } from "../../lib/frontend/web3.ts";
import { ZeroAddress } from "$ethers";

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

            if (data[0].closed) {
                // If it's closed in the database, I redirect to accounts page, no need to run more code!
                const headers = new Headers();
                headers.set("location", "/app/accounts");
                return new Response(null, {
                    status: 303,
                    headers,
                });
            }

            const networkId = data[0].network_id;

            const onChainAccount = await refreshDBBalance(data, query, queryBuilder)

            if (!onChainAccount.account[0]) {
                // If it's closed I redirect to accounts page!
                const headers = new Headers();
                headers.set("location", "/app/accounts");
                return new Response(null, {
                    status: 303,
                    headers,
                });
            }

            const { data: missedPayments } = await select.PaymentIntents.forAccountbyAccountBalanceTooLow(data[0].id)

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
                    accountType: data[0].accountType,
                    missedPayments
                });

        } catch (err) {
            console.log(err);
            return new Response(null, { status: 500 })
        }
    }
}

export default function Account(props: PageProps) {
    if (props.data.notfound) {
        return <div class="container mx-auto py-8">
            <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
                <h1 class="text-2xl font-bold mb-6 text-center">Account Not Found</h1>
            </div>
        </div>;
    }

    const balance = props.data.accountData.account[3];
    const tokenAddress = props.data.accountData.account[2];
    const creatorAddress = props.data.accountData.account[1];
    const accountType = props.data.accountType;
    const currencyName = JSON.parse(props.data.currency).name;
    const missedPayments = props.data.missedPayments.reduce((acc: any, currentValue: any) => {
        if (currentValue.pricing === Pricing.Fixed) {
            return acc + parseEther(currentValue.maxDebitAmount)
        } else {
            return acc + parseEther(currentValue.failedDynamicPaymentAmount)
        };
    }, parseEther("0"));

    const balanceMessage = accountType === AccountTypes.VIRTUALACCOUNT
        ? <p class="text-left text-red-600">You missed payments! Top up your account with at least {formatEther(missedPayments)} {currencyName}</p>
        : <p class="text-left text-red-600">You missed payments! You are missing {formatEther(missedPayments)} {currencyName}  from you spendable balance! Make sure to have enough balance in your wallet and update your allowance. </p>


    const showBalanceMessage = missedPayments === BigInt("0") ? null : balanceMessage

    return <Layout renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token} >
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
                            currencyName={currencyName}
                        ></WalletDetailsFetcher>
                        <div class="w-80">
                            {showBalanceMessage}
                        </div>
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
    </Layout>
}