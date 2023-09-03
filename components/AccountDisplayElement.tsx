import { AccountCardElement } from "./AccountCardElement.tsx";

interface AccountDisplayElementProps {
    amount: string,
    currency: string,
    createdDate: string,
    networkName: string,
    networkId: string,
    commitment: string,
    name: string,
    extraCSS: string
}

export function AccountDisplayElement(props: AccountDisplayElementProps) {
    const accountQuery = JSON.stringify(
        {
            networkId: props.networkId,
            commitment: props.commitment,
            name: props.name,
            currency: props.currency
        }
    )
    return <a href={`/app/account?q=${accountQuery}`} class={`cardshadow mt-2 mb-2 cursor-pointer ${props.extraCSS}`}>
        <AccountCardElement
            name={props.name}
            balance={props.amount}
            currency={props.currency}
            network={props.networkName}></AccountCardElement>
    </a>
}
