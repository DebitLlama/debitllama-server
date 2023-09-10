
export interface AccountCardElementProps {
    network: string,
    balance: string,
    currency: string,
    name: string
}

export function AccountCardElement(props: AccountCardElementProps) {
    return <div class="accountCard_container">
        <div class="account_card">
            <div class="visa_logo">
                <img src="/logo_white.svg" alt="" />
            </div>
            <div class="visa_info">
                <p>{props.balance}{" "}{props.currency} </p>
                <p>{props.name}</p>
            </div>
            <div class="visa_crinfo">
                <p>{props.network}</p>
            </div>
        </div>
    </div>
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
                <p>{props.balance}{" "}{props.currency} </p>
            </div>
        </div>
    </div>
}