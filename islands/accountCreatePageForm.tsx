import { useState } from 'preact/hooks';

import CurrencySelectDropdown from "./CurrencySelectDropdown.tsx";
import AccountPasswordInput from "./accountPasswordInput.tsx";
import { isEthereumUndefined, redirectToMetamask, requestAccounts } from "../lib/frontend/web3.ts";
import { newAccountSecrets } from '../lib/frontend/directdebitlib.ts';

const strength = [
    "Worst ☹",
    "Bad ☹",
    "Weak ☹",
    "Good ☺",
    "Strong ☻"
]

export default function AccountCreatePageForm() {
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [passwordStrengthNotification, setPasswordStrengthNotification] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);

    function setPasswordAndCheck(to: string) {
        if (to === "") {
            setPasswordStrengthNotification("");
        } else {
            //@ts-ignore client-side imported library for password strength checking
            const result = zxcvbn(password);
            const score = result.score as number;
            setPasswordScore(score);
            const notification = "Strength: " + strength[score] + " " + result.feedback.warning + " " + result.feedback.suggestions;
            setPasswordStrengthNotification(notification);
        }

        setPassword(to);
        if (passwordAgain != to && passwordAgain !== "") {
            setPasswordMatchError("Password mismatch");
        } else {
            setPasswordMatchError("")
        }
    }

    function sentAndcheckPasswordMatch(setTo: string) {
        setPasswordAgain(setTo);
        if (password !== setTo) {
            setPasswordMatchError("Password mismatch");
        } else {
            setPasswordMatchError("")
        }
    }

    function isButtonDisabled(): boolean {
        if (passwordScore < 3) {
            return true;
        }

        if (passwordAgain == "") {
            return true;
        }

        if (passwordMatchError !== "") {
            return true;
        }
        return false;
    }

    async function onSubmitForm(event: any) {
        event.preventDefault();
        // I check if I can find a wallet
        const web3Undefined = isEthereumUndefined();
        if (web3Undefined) {
            redirectToMetamask();
            return;
        }
        await requestAccounts();

        // I generate the secret here

        const note = newAccountSecrets();
        console.log(note);



        // Encrypt the secret (I need to generate the public key too and import eth-sig-utils)


        // I submit it to the blockchain 

        // Then after the transaction is confirmed I will save the transaction in supabase on the backend

        // and I redirect to the virtual account's page where it show the details and can be withdrawn or topped up!


        // return true;
    }


    return <form onSubmit={onSubmitForm} class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" method="POST">
        <h1 class="text-2xl font-bold mb-6 text-center">New Virtual Account</h1>

        <CurrencySelectDropdown></CurrencySelectDropdown>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Deposit Amount</label>
            <input required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="number" id="amount" name="amount" placeholder="0" />
        </div>
        <AccountPasswordInput
            password={password}
            setPassword={setPasswordAndCheck}
            passwordAgain={passwordAgain}
            setPasswordAgain={sentAndcheckPasswordMatch}
            passwordMatchError={passwordMatchError}
            passwordStrengthNotification={passwordStrengthNotification}
        ></AccountPasswordInput>
        <button
            disabled={isButtonDisabled()}
            class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300"
            type="submit">Create Account</button>
    </form>
}