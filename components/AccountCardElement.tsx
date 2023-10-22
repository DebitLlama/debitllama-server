import { AccountTypes } from "../lib/enums.ts";

export interface AccountCardElementProps {
    network: string,
    balance: string,
    currency: string,
    name: string,
    accountType: AccountTypes,
    closed: boolean
}


export function AccountCardElement(props: AccountCardElementProps) {
    const currName = JSON.parse(props.currency).name;
    const info = <div class="visa_info">
        {props.closed ? <p style="color: red !important;">{currName} Account Closed</p> : <p>{props.balance}{" "}{currName} </p>}
        <pre class="overflow-y-clip text-white" >{props.name}</pre>
    </div>

    return <div class="accountCard_container">
        <div class="account_card">
            <div class="visa_logo">
                <img src="/logo_white.svg" alt="DebitLlama logo" />
            </div>
            {info}
            <div class="visa_crinfo">
                <p>{props.network}</p>
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
