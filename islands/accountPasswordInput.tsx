// deno-lint-ignore-file no-explicit-any

import { AccountAccess } from "../lib/enums.ts";
import AccountAccessToggle from "./utils/AccountAccessToggle.tsx";


export interface AccountPasswordInputProps {
    password: string,
    setPassword: (to: string) => void;
    passwordAgain: string;
    setPasswordAgain: (to: string) => void;
    passwordStrengthNotification: string;
    passwordMatchError: string;
    title: string;
    accountAccessSelected: AccountAccess,
    setAccountAccessSelected: (to: AccountAccess) => void;
    commitment: string,
    setCommitment: (to: string) => void
}

export default function AccountPasswordInput(props: AccountPasswordInputProps) {
    return <>
        <AccountAccessToggle
            accountAccessSelected={props.accountAccessSelected}
            setAccountAccessSelected={props.setAccountAccessSelected}
        ></AccountAccessToggle>
        {props.accountAccessSelected === "agent" ? <>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="commitment">Commitment</label>
                <input
                    value={props.commitment}
                    onKeyUp={(event: any) => props.setCommitment(event.target.value)}
                    onChange={(event: any) => props.setCommitment(event.target.value)}
                    required
                    data-lpignore="true"
                    autocomplete={"off"}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    type="text" id="commitment" name="commitment" placeholder="Commitment" />
                <p class="text-sm text-gray-500 py-4 px-2">Enter the commitment created with the debitllama-mcp service so your agent can use this account for payments</p>
            </div>
        </> : <></>}
    </>
}

interface PasswordStrengthDisplayProps {
    passwordStrengthNotification: string
}

function PasswordStrengthDisplay(props: PasswordStrengthDisplayProps) {
    return <div class="bg-white w-full border-gray-300  border-dotted border-2 rounded-b-lg flex flex-col text-md py-4 px-2 text-gray-800 ">
        <div>{props.passwordStrengthNotification === "" ? "Password Strength: None" : props.passwordStrengthNotification}</div>

    </div>
}