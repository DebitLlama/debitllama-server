import WalletDetailsFetcher from "../../islands/WalletDetailsFetcher.tsx";
import { approveBalance, refreshBalanceClick } from "../../lib/checkout/web3.ts";
import { AccountTypes } from "../../lib/enums.ts";
import { formatEther, parseEther } from "../../lib/frontend/web3.ts";
import { ChainIds } from "../../lib/shared/web3.ts";
import { ItemProps } from "../../lib/types/checkoutTypes.ts";
import { UnderlinedTd } from "../components.tsx";
import { handleError } from "./HandleCheckoutError.ts";
import { ApprovalIcon, RefreshIcon } from "./Icons.tsx";

export function RefreshBalanceUI(props: {
    paymentAmount: string,
    selectedAccount: any,
    topupAmount: number,
    setTopupAmount: (to: number) => void,
    item: ItemProps,
    setShowOverlay: (to: boolean) => void
}) {
    const amountToTopUpWEI = parseEther(props.paymentAmount) - parseEther(props.selectedAccount.balance);
    const amountToTopUpFormatted = parseFloat(formatEther(amountToTopUpWEI));
    const inputValue = props.topupAmount < amountToTopUpFormatted ? amountToTopUpFormatted : props.topupAmount;
    return <div class="flex flex-col p-3 rounded-xl">
        <div class="flex flex-row justify-left text-lg text-gray-900 p-3">
            <h2><strong>Insufficient balance!</strong> <br /> Update it or select another account!</h2>
        </div>
        <WalletDetailsFetcher
            // This is only rendered when a connected wallet is selected!
            accountType={AccountTypes.CONNECTEDWALLET}
            creatorAddress={props.selectedAccount.creator_address}
            networkId={props.item.network as ChainIds}
            tokenAddress={props.item.currency.contractAddress}
            currencyName={props.item.currency.name}
        ></WalletDetailsFetcher>
        <table class="table-fixed w-full">
            <thead>
                <tr>
                    <th class="w-2/6"></th>
                    <th class="w-2/6"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <UnderlinedTd extraStyles="rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-lg font-bold" >Update Allowance</UnderlinedTd>
                    <UnderlinedTd extraStyles="importantNoPaddingLeft rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-sm font-bold" >
                        <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            value={inputValue} onChange={(event: any) => props.setTopupAmount(parseFloat(event.target.value))} type="number" id="amount" name="amount" placeholder="Amount" />
                        <button
                            onClick={approveBalance({
                                topupAmount: inputValue,
                                commitment: props.selectedAccount.commitment,
                                chainId: props.item.network,
                                handleError,
                                currency: props.item.currency,
                                setShowOverlay: props.setShowOverlay
                            })}
                            class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                            <div class="flex flex-col justify-center">
                                <p class="pt-1">Approve</p>
                            </div>
                            <div class="flex flex-col justify-center">
                                <ApprovalIcon width="30" />
                            </div>
                        </button>
                    </UnderlinedTd>
                </tr>
                <tr>
                    <UnderlinedTd extraStyles="rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-lg font-bold" >Refresh Balance</UnderlinedTd>
                    <UnderlinedTd extraStyles="importantNoPaddingLeft rounded-lg bg-gray-50 dark:bg-black-800 text-black-400 dark:text-black-200 text-sm font-bold" >
                        <p>You just added balance to the connected wallet, but can't see it?</p>
                        <button
                            onClick={refreshBalanceClick({
                                topupAmount: inputValue,
                                commitment: props.selectedAccount.commitment,
                                chainId: props.item.network,
                                handleError,
                                currency: props.item.currency,
                                setShowOverlay: props.setShowOverlay
                            })}
                            class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                            <div class="flex flex-col justify-center">
                                <p>Refresh</p>
                            </div>
                            <div class="flex flex-col justify-center">
                                <RefreshIcon width="30" />
                            </div>
                        </button>
                    </UnderlinedTd>
                </tr>
            </tbody>
        </table>
    </div>
}

