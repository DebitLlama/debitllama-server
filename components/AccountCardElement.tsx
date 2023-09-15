import { AccountTypes } from "../lib/enums.ts";

export interface AccountCardElementProps {
    network: string,
    balance: string,
    currency: string,
    name: string,
    accountType: AccountTypes,
    closed: boolean
}

function ConnectionLogo() {
    return <svg style={"margin-top: 2px;"} height="24" viewBox="0 -960 960 960" width="24" version="1.1" id="svg866" xmlns="http://www.w3.org/2000/svg">
        <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" id="path864" style="fill:#ffffff" />
    </svg>;
}

export function AccountCardElement(props: AccountCardElementProps) {
    const currName = JSON.parse(props.currency).name;
    const info = props.accountType === AccountTypes.VIRTUALACCOUNT ? <div class="visa_info">
        {props.closed ? <p style="color: red !important;">{currName} Account Closed</p> : <p>{props.balance}{" "}{currName} </p>}
        <p>{props.name}</p>
    </div> : <div class="visa_info">
        <p class="flex flex-row"><ConnectionLogo></ConnectionLogo> {currName}</p>
        <p>{props.name}</p>
    </div>

    return <div class="accountCard_container">
        <div class="account_card">
            <div class="visa_logo">
                <img src="/logo_white.svg" alt="" />
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

//TODO: create one for checkout also!

export function CheckoutAccountCardElement(props: AccountCardElementProps) {
    return <div class="checkout_accountCard_container">
        <div class="checkout_account_card">
            {/* <div class="checkout_visa_logo">
                <img src="/logo_white.svg" alt="" />
            </div> */}
            <div class="checkout_visa_info">
                <p>{props.name}</p>
            </div>
            <div class="checkout_visa_crinfo">
                <p>{props.balance}{" "}{JSON.parse(props.currency).name} </p>
            </div>
        </div>
    </div>
}