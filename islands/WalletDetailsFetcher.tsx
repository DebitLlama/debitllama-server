import { AccountTypes } from "../lib/enums.ts";
import { useEffect, useState } from 'preact/hooks';
import { ChainIds, getConnectedWalletsContractAddress } from "../lib/shared/web3.ts";

import { balanceOf, getAllowance, getJSONRPCProvider, isZero, isAddress, getRpcContract, formatUnits } from "../lib/frontend/web3.ts";
import { ExplorerLinkForAddress } from "../components/components.tsx";


export interface ConnectedWalletDetailsFetcherProps {
    accountType: AccountTypes,
    creatorAddress: string,
    networkId: ChainIds,
    tokenAddress: string,
    currencyName: string,
}
export default function WalletDetailsFetcher(props: ConnectedWalletDetailsFetcherProps) {

    const [connectedWalletBalance, setConnectedWalletBalance] = useState("⏳");
    const [currentApprovalAmount, setCurrentApprovalAmount] = useState("⏳");
    const [spendableBalance, setSpendableBalance] = useState("⏳");

    async function fetchAndSetBalanceAndApproval() {
        try {
            const connectedWalletContractAddress = getConnectedWalletsContractAddress[props.networkId];
            const provider = getJSONRPCProvider(props.networkId);
            const erc20Contract: any = await getRpcContract(provider, props.tokenAddress, "/ERC20.json");

            const [balance, allowance, rawDecimals] = await Promise.all([
                balanceOf(erc20Contract, props.creatorAddress),
                getAllowance(erc20Contract, props.creatorAddress, connectedWalletContractAddress),
                erc20Contract.decimals(),
            ]);
            const decimals = Number(rawDecimals);

            const spendable = allowance >= balance ? balance : allowance;

            setConnectedWalletBalance(formatUnits(balance, decimals) + " " + props.currencyName);
            setCurrentApprovalAmount(formatUnits(allowance, decimals) + " " + props.currencyName);
            setSpendableBalance(formatUnits(spendable, decimals) + " " + props.currencyName);
        } catch (err) {
            console.error(err);
            setConnectedWalletBalance("Error");
            setCurrentApprovalAmount("Error");
            setSpendableBalance("Error");
        }
    }

    useEffect(() => {
        if (props.accountType === AccountTypes.VIRTUALACCOUNT) {
            // No details fetching on Virtual account!
            return;
        } else {
            // Fetch the details and set the balances
            fetchAndSetBalanceAndApproval();
        }
    }, []);
    return <table>
        <thead>
            <tr>
                <th class="w-2/6"></th>
                <th class="w-2/6"></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500  whitespace-nowrap"}>{props.accountType === AccountTypes.CONNECTEDWALLET ? "Connected Wallet:" : "Creator Address"}</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto  overflow-y-hide overflowingTableData"> <ExplorerLinkForAddress chainId={props.networkId} address={props.creatorAddress}></ExplorerLinkForAddress></div></td>
            </tr>
            {!isZero(props.tokenAddress) && isAddress(props.tokenAddress) ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500  whitespace-nowrap"}>Token Address:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto  overflow-y-hide overflowingTableData"><ExplorerLinkForAddress chainId={props.networkId} address={props.tokenAddress}></ExplorerLinkForAddress> </div></td>
            </tr> : null}
            {props.accountType === AccountTypes.CONNECTEDWALLET ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500  whitespace-nowrap"}>Wallet Balance:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class={`overflow-x-auto overflow-y-hide overflowingTableData `} > <small class={`${connectedWalletBalance === "⏳" ? `icon-blinker` : ""}`} >{connectedWalletBalance}</small> </div></td>
            </tr> : null}
            {props.accountType === AccountTypes.CONNECTEDWALLET ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500  whitespace-nowrap"}>Allowance:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class={`overflow-x-auto overflow-y-hide overflowingTableData`} > <small class={`${currentApprovalAmount === "⏳" ? `icon-blinker` : ""}`} >{currentApprovalAmount}</small> </div></td>
            </tr> : null}
            {props.accountType === AccountTypes.CONNECTEDWALLET ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500  whitespace-nowrap"}>Spendable balance:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class={`overflow-x-auto  overflow-y-hide overflowingTableData`} > <strong class={`${spendableBalance === "⏳" ? `icon-blinker` : ""}`}>{spendableBalance}</strong> </div></td>
            </tr> : null}
        </tbody>
    </table>
}