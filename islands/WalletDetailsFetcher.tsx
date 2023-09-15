import { AccountTypes } from "../lib/enums.ts";
import { useEffect, useState } from 'preact/hooks';
import { ChainIds, getConnectedWalletsContractAddress } from "../lib/shared/web3.ts";

import { balanceOf, formatEther, getAllowance, getContract, getJSONRPCProvider, isZero, isAddress } from "../lib/frontend/web3.ts";


export interface ConnectedWalletDetailsFetcherProps {
    accountType: AccountTypes,
    creatorAddress: string,
    networkId: ChainIds,
    tokenAddress: string,
    currencyName: string,
    updateBalance: (to: string) => void;
}
export default function WalletDetailsFetcher(props: ConnectedWalletDetailsFetcherProps) {
    const [connectedWalletBalance, setConnectedWalletBalance] = useState("⏳");
    const [currentApprovalAmount, setCurrentApprovalAmount] = useState("⏳");
    const [spendableBalance, setSpendableBalance] = useState("⏳");

    async function fetchAndSetBalanceAndApproval() {
        const connectedWalletContractAddress = getConnectedWalletsContractAddress[props.networkId];
        const provider = getJSONRPCProvider(props.networkId);
        const erc20Contract = await getContract(provider, props.tokenAddress, "/ERC20.json");
        const balance = await balanceOf(erc20Contract, props.creatorAddress);
        const allowance = await getAllowance(erc20Contract, props.creatorAddress, connectedWalletContractAddress)
        setConnectedWalletBalance(formatEther(balance) + " " + props.currencyName);
        setCurrentApprovalAmount(formatEther(allowance) + " " + props.currencyName);
        if (allowance >= balance) {
            setSpendableBalance(formatEther(balance) + " " + props.currencyName)
            props.updateBalance(formatEther(balance))
        } else {
            setSpendableBalance(formatEther(allowance) + " " + props.currencyName);
            props.updateBalance(formatEther(allowance))
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
                <th ></th>
                <th ></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>{props.accountType === AccountTypes.CONNECTEDWALLET ? "Connected Wallet:" : "Creator Address"}</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <small>{props.creatorAddress}</small> </div></td>
            </tr>
            {!isZero(props.tokenAddress) && isAddress(props.tokenAddress) ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Token Address:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <small>{props.tokenAddress}</small> </div></td>
            </tr> : null}
            {props.accountType === AccountTypes.CONNECTEDWALLET ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Wallet Balance:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <small>{connectedWalletBalance}</small> </div></td>
            </tr> : null}
            {props.accountType === AccountTypes.CONNECTEDWALLET ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Allowance:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <small>{currentApprovalAmount}</small> </div></td>
            </tr> : null}
            {props.accountType === AccountTypes.CONNECTEDWALLET ? <tr>
                <td class={"bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"}>Spendable balance:</td>
                <td class={"px-4 py-4 text-sm whitespace-nowrap"}><div class="overflow-x-auto overflowingTableData"> <strong>{spendableBalance}</strong> </div></td>
            </tr> : null}
        </tbody>
    </table>
}