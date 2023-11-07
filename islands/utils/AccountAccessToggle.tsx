import { KeyLogo, PasswordLogo } from "../../components/components.tsx";
import { AccountAccess } from "../../lib/enums.ts";

export interface AccountAccessToggleProps {
    accountAccessSelected: AccountAccess,
    setAccountAccessSelected: (to: AccountAccess) => void;
}

export default function AccountAccessToggle(props: AccountAccessToggleProps) {

    const hightlight = (name: AccountAccess) => {
        if (props.accountAccessSelected === name) {
            return "bg-gray-300";
        } else {
            return ""
        }
    }

    return <div class="flex flex-col justify-center">
        <div class="flex flex-row justify-center mb-2">
            <small class="text-gray-800">Select how you want to access your account when approving subscription payments</small>
        </div>
        <div class="flex flex-row justify-center mb-5">
            <button onClick={() => props.setAccountAccessSelected(AccountAccess.metamask)} aria-label="Access account with metamask" type="button"
                class={`select-none flex flex-col justify-center border-t-2 border-b-2 border-l-2 pr-2 pl-2 hover:bg-gray-200 ${hightlight(AccountAccess.metamask)}`}>
                <img class="mx-auto" width="45px" height="45px" src="/MetaMask_Icon_Color.svg" />
                <small class="text-gray-700">Metamask</small>
            </button>
            <button onClick={() => props.setAccountAccessSelected(AccountAccess.password)} aria-label="Access account with password" type="button"
                class={`select-none flex flex-col justify-center border-t-2 border-b-2 border-l-2 border-r-2 border-l-dotted border-r-dotted pr-2 pl-2 hover:bg-gray-200 ${hightlight(AccountAccess.password)}`}>
                <PasswordLogo></PasswordLogo>
                <small class="text-gray-700">Password</small>
            </button>
            <button onClick={() => props.setAccountAccessSelected(AccountAccess.passkey)} aria-label="Access account with passkey" type="button"
                class={`select-none flex flex-col justify-center border-t-2 border-b-2 border-r-2 pl-2 pr-2 hover:bg-gray-200 ${hightlight(AccountAccess.passkey)}`}>
                <KeyLogo></KeyLogo>
                <small class="text-gray-700">Passkey</small>
            </button>
        </div>
    </div>
}