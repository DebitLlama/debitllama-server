import WalletBalanceDisplay from "../islands/WalletBalanceDisplay.tsx";
import { AccountTypes } from "../lib/enums.ts";
import { ChainIds } from "../lib/shared/web3.ts";

export interface AccountCardElementProps {
    network: string,
    balance: string,
    currency: string,
    name: string,
    accountType: AccountTypes,
    closed: boolean
    commitment: string,
    calledFrom: "app" | "buyPage"
    networkName: string;
}


export function AccountCardElement(props: AccountCardElementProps) {
    const currName = JSON.parse(props.currency).name;
    const info = <div class="visa_info">
        {props.closed ? <p style="color: red !important;">{currName} Account Closed</p> :
            <WalletBalanceDisplay
                calledFrom={props.calledFrom}
                currency={props.currency}
                accountType={props.accountType}
                network={props.network as ChainIds}
                commitment={props.commitment}
                oldBalance={props.balance}></WalletBalanceDisplay>}
        <pre class="overflow-y-clip text-white" >{props.name}</pre>
    </div>

    return <div class="accountCard_container">
        <div class="account_card">
            <div class="visa_logo">
                <img src="/logo_white.svg" alt="DebitLlama logo" />
            </div>
            {info}
            <div class="visa_crinfo">
                <p>{props.networkName}</p>
            </div>
            <div class={"visa_crinfo"}>
                <p>{formatAccountType(props.accountType)}</p>
            </div>
        </div>
    </div>
}

function formatAccountType(accountTypes: AccountTypes) {
    switch (accountTypes) {
        case AccountTypes.VIRTUALACCOUNT:
            return "Virtual Account"
        case AccountTypes.CONNECTEDWALLET:
            return "Connected Wallet"

        default:
            return ""
    }
}
