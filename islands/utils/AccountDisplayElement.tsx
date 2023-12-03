import { AccountTypes } from "../../lib/enums.ts";
import { AccountCardElement } from "../../components/AccountCardElement.tsx";

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

export default function AccountDisplayElement(props: AccountDisplayElementProps) {
    // I'm gonna update this to be an island and it's going to fetch the account balance from the blockchain and if it's not the same as the balance props, it will request a refresh!
    return <a href={props.closed ? "#" : `/app/account?q=${props.commitment}`} class={`cardshadow mt-2 mb-2 cursor-pointer ${props.extraCSS}`}>
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
