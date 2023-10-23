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
        console.time("req");
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
            console.time("refreshBalance");
            //TODO: Create a refresh balance island button instead or deffer this somehow
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
            console.timeEnd("refreshBalance")
            const { data: missedPayments } = await select.PaymentIntents.forAccountbyAccountBalanceTooLow(data[0].id)

            // const { data: affiliatedAccounts } = await select.AffiliatedAccounts.byCommitment(query);

            // const affiliatedAccountsExists = affiliatedAccounts.length > 0;
            console.timeEnd("req")
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
                    missedPayments,
                    // affiliateCode: affiliatedAccountsExists ? affiliatedAccounts[0].affiliate_code : ""
                    affiliateCode: ""
                });

        } catch (err) {
            console.log(err);
            return new Response(null, { status: 500 })
        }
    },
    // This is used to save the affiliate code!
    async POST(_req, _ctx) {
        const formData = await _req.formData();
        const code = formData.get("code") as string;
        const commitment = formData.get("commitment") as string;
        const queryBuilder = new QueryBuilder(_ctx);
        const select = queryBuilder.select();
        const headers = new Headers();

        if (code.length !== 0) {
            const codeExists = await select.AffiliateCodes.codeExists(code);


            if (codeExists.data.length === 0) {
                headers.set("location", `/app/account?q=${commitment}&error=${"Invalid Code"}`);
                return new Response(null, { status: 303, headers })
            }
        }

        const AffiliatedAlready = await select.AffiliatedAccounts.byCommitment(commitment);

        let deletedIt = false;


        if (AffiliatedAlready.data.length === 0) {
            // I insert
            await queryBuilder.insert().AffiliatedAccounts.byCommitment(commitment, code);
        } else {
            if (code.length !== 0) {
                // I update but... 
                //if the code is empty I delete
                await queryBuilder.update().AffiliatedAccounts.byCommitment(commitment, code);
            } else {
                await queryBuilder.delete().AffiliatedAccounts.byCommitment(commitment);
                deletedIt = true;
            }
        }

        if (deletedIt) {
            headers.set("location", `/app/account?q=${commitment}&success=${"Affiliate code deleted!"}`);
            return new Response(null, { status: 303, headers })
        } else {
            headers.set("location", `/app/account?q=${commitment}&success=${"Affiliate code updated!"}`);
            return new Response(null, { status: 303, headers })
        }

    }
}

export default function Account(props: PageProps) {
    const err = props.url.searchParams.get("error");
    const success = props.url.searchParams.get("success");

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

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token} >
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
                    <hr />
                    <form class="flex flex-row justify-center" method="post">
                        <input type="hidden" value={props.data.commitment} name="commitment" />
                        <div class="relative mb-4 flex flex-wrap items-stretch">
                            <span
                                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                                id="basic-addon1"
                            >
                                <button
                                    type="submit"
                                    aria-label={"Save code button"}
                                    class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                                    Add code
                                </button></span>
                            <input
                                type="text"
                                class="relative m-0 block min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                placeholder="Enter Affiliate Code"
                                aria-label="Affiliate code"
                                name="code"

                                id="affiliatecode"
                                value={props.data.affiliateCode}
                            />
                        </div>
                    </form>
                    <div class="flex flex-row justify-center">
                        <p class="w-64">An affiliate code lets you share some of your transaction fees with another account.</p>
                    </div>
                    {err && (
                        <div class="bg-red-400 border-l-4 p-4" role="alert">
                            <p class="font-bold">Error</p>
                            <p>{err}</p>
                        </div>
                    )}
                    {success && (
                        <div class="bg-green-400 border-l-4 p-4" role="alert">
                            <p class="font-bold">Code Updated</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Layout>
}