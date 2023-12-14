import { useEffect, useState } from "preact/hooks";
import { AccountTypes } from "../lib/enums.ts";
import { formatEther, getContract, getJSONRPCProvider, getRpcContract, parseEther } from "../lib/frontend/web3.ts";
import { ChainIds, ConnectedWalletsContractAddress, VirtualAccountsContractAddress, getConnectedWalletsContractAddress, getVirtualAccountsContractAddress } from "../lib/shared/web3.ts";
import { requestBalanceRefresh } from "../lib/frontend/fetch.ts";

export interface WalletBalanceDisplayProps {
    commitment: string;
    network: ChainIds;
    accountType: AccountTypes;
    currency: string;
    oldBalance: string;
    calledFrom: "app" | "buyPage"
}

export default function WalletBalanceDisplay(props: WalletBalanceDisplayProps) {
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState("0");

    useEffect(() => {
        async function fetchNewBalance() {
            setLoading(true);
            const provider = getJSONRPCProvider(props.network);
            let contractAddr: ConnectedWalletsContractAddress | VirtualAccountsContractAddress | "" = "";
            if (props.accountType === AccountTypes.CONNECTEDWALLET) {
                contractAddr = getConnectedWalletsContractAddress[props.network]
            } else if (props.accountType === AccountTypes.VIRTUALACCOUNT) {
                contractAddr = getVirtualAccountsContractAddress[props.network]
            }

            const debitcontract: any = await getRpcContract(
                provider,
                contractAddr,
                "/DirectDebit.json",
            );
            const account = await debitcontract.getAccount(props.commitment)
            const balance = account[3];
            if (parseEther(props.oldBalance) !== balance) {
                //send a request to update balance if the old is not new
                console.log("sending a balance refresh!")
                await requestBalanceRefresh(props.commitment, props.network, props.calledFrom);
            }
            setTimeout(() => {
                setLoading(false);
                setWalletBalance(formatEther((balance)));
            }, 1000)

        }
        fetchNewBalance();
    }, [props.network, props.commitment])

    if (loading) {
        return <p class="blink">Loading...</p>
    }
    return <p>{walletBalance} {JSON.parse(props.currency).name}</p>
}