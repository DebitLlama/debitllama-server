import { AccountTypes } from "../lib/enums.ts";
import { AccountCardElement } from "./AccountCardElement.tsx";

interface AccountDisplayElementProps {
    amount: string,
    currency: string,
    createdDate: string,
    networkName: string,
    networkId: string,
    commitment: string,
    name: string,
    extraCSS: string,
    accountType: AccountTypes
    closed: boolean
}

export function AccountDisplayElement(props: AccountDisplayElementProps) {
    return <a href={`/app/account?q=${props.commitment}`} class={`cardshadow mt-2 mb-2 cursor-pointer ${props.extraCSS}`}>
        <AccountCardElement
            name={props.name}
            balance={props.amount}
            currency={props.currency}
            network={props.networkName}
            accountType={props.accountType}
            closed={props.closed}
        ></AccountCardElement>
    </a>
}
