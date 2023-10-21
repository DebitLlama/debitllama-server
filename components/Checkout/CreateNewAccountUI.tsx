import AccountPasswordInput, { AccountPasswordInputProps } from "../../islands/accountPasswordInput.tsx";
import { onCreateAccountSubmit } from "../../lib/checkout/web3.ts";
import { AccountTypes } from "../../lib/enums.ts";
import { ItemProps } from "../../lib/types/checkoutTypes.ts";
import BuyPageProfile, { ProfileProps } from "../BuyPageProfile.tsx";
import { TooltipWithTitle } from "../components.tsx";
import { handleError } from "./HandleCheckoutError.ts";

export function CreateNewAccountUI(props: {
    item: ItemProps,
    profileExists: boolean,
    profile: ProfileProps
    newAccountPasswordProps: AccountPasswordInputProps,
    paymentAmount: string,
    ethEncryptPublicKey: string;
    setShowOverlay: (to: boolean) => void;
    setPasswordAndCheck: (to: string) => void;
    isButtonDisabled: () => boolean;
    sentAndcheckPasswordMatch: (setTo: string) => void;
    accountTypeSwitchValue: AccountTypes;
    setAccountTypeSwitchValue: (to: AccountTypes) => void;

}) {
    const isERC20 = !props.item.currency.native;

    return <form class="p-2" onSubmit={onCreateAccountSubmit({
        chainId: props.item.network,
        handleError,
        profileExists: props.profileExists,
        profile: props.profile,
        passwordProps: props.newAccountPasswordProps,
        selectedCurrency: props.item.currency,
        depositAmount: props.paymentAmount,
        ethEncryptPublicKey: props.ethEncryptPublicKey,
        accountCurrency: props.item.currency.name,
        setShowOverlay: props.setShowOverlay,
        accountTypeSwitchValue: props.accountTypeSwitchValue
    })}>
        <BuyPageProfile
            profileExists={props.profileExists}
            profile={props.profile}></BuyPageProfile>
        <div class="py-[0.25rem]">
            <hr
                class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            {isERC20 ?
                <div class="flex flex-row justify-center mb-4">

                    <label class="toggle select-none bg-gray-200 hover:bg-gray-100 border p-4 text-center w-full">
                        <span class={`toggle-label text-sm ${props.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT ? "text-indigo-800" : "text-neutral"}`}>
                            Virtual Account
                        </span>
                        <input checked={props.accountTypeSwitchValue === AccountTypes.CONNECTEDWALLET} onChange={(event: any) => {
                            if (event.target.checked) {
                                props.setAccountTypeSwitchValue(AccountTypes.CONNECTEDWALLET)
                            } else {
                                props.setAccountTypeSwitchValue(AccountTypes.VIRTUALACCOUNT)
                            }
                        }} class="toggle-checkbox" type="checkbox" />
                        <div class="toggle-switch"></div>
                        <span class={`toggle-label text-sm ${props.accountTypeSwitchValue === AccountTypes.CONNECTEDWALLET ? "text-indigo-800" : "text-neutral"}`}>
                            Connect Wallet
                        </span>
                    </label>
                </div> : null}

            {isERC20 ? <TooltipWithTitle
                title="Which account to choose?"
                extraStyle="right: -70%"
                message="Virtual accounts hold deposits and need to be topped up while connected wallets let you make payments using tokens you hold in a cold wallet."></TooltipWithTitle>
                :
                <TooltipWithTitle
                    title="Virtual Account?"
                    extraStyle="right: -70%"
                    message="Virtual accounts are smart contract accounts that hold deposits. The value must be deposited into them. They can be created per subscription if you want!"></TooltipWithTitle>}

            <hr
                class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="accountName">Account Name</label>
                <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    type="text" id="accountName" name="accountName" placeholder="" />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">{props.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT ? "Deposit " : "Approve spending "} {props.item.currency.name}</label>
                <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    value={props.paymentAmount} type="number" id="amount" name="amount" placeholder="0" step="any" />
            </div>
            <AccountPasswordInput
                title={"Account Password"}
                password={props.newAccountPasswordProps.password}
                setPassword={props.setPasswordAndCheck}
                passwordAgain={props.newAccountPasswordProps.passwordAgain}
                setPasswordAgain={props.sentAndcheckPasswordMatch}
                passwordMatchError={props.newAccountPasswordProps.passwordMatchError}
                passwordStrengthNotification={props.newAccountPasswordProps.passwordStrengthNotification}
            ></AccountPasswordInput>
            <div class="text-center">
                <button
                    disabled={props.isButtonDisabled()}
                    type="submit"
                    class="mb-4 mt-2 bg-indigo-500 text-white text-xl font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
                >{props.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT ? "Create Account" : "Connect Wallet"}</button>
            </div>
        </div>
    </form>
}


