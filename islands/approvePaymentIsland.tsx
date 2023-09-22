import { AccountCardElement } from "../components/AccountCardElement.tsx";
import { AccountTypes } from "../lib/enums.ts";
import { createPaymentIntent, toNoteHex } from "../lib/frontend/directdebitlib.ts";
import { aesDecryptData } from "../lib/frontend/encryption.ts";
import { logoutRequest, redirectToRedirectPage, uploadPaymentIntent } from "../lib/frontend/fetch.ts";
import { parseEther } from "../lib/frontend/web3.ts";
import { ItemProps } from "./buyButtonPage.tsx";
import { useState } from 'preact/hooks';

interface ApprovePaymentIslandProps {
    symmetricEncryptedNote: string,
    itemData: ItemProps,
    accountcommitment: string,
    accountName: string,
    accountBalance: string,
    accountCurrency: string,
    accountType: AccountTypes,
    closed: boolean
}


export default function ApprovePaymentIsland(props: ApprovePaymentIslandProps) {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    async function payClicked() {
        const decryptedNote = await aesDecryptData(props.symmetricEncryptedNote, password);
        if (decryptedNote === "") {
            setErrorMessage("Invalid password");
            return;
        } else {
            setErrorMessage("");
        }
        const paymentIntent = await createPaymentIntent({
            paymentIntentSecret: {
                note: decryptedNote,
                payee: props.itemData.payeeAddress,
                maxDebitAmount: parseEther(props.itemData.maxPrice),
                debitTimes: props.itemData.debitTimes,
                debitInterval: props.itemData.debitInterval
            },
            snarkArtifacts: {
                wasmFilePath: "/directDebit.wasm",
                zkeyFilePath: "/directDebit_0001.zkey"
            }
        }).catch(err => console.error(err));
        if (paymentIntent !== null) {

            await uploadPaymentIntent({
                button_id: props.itemData.buttonId,
                proof: JSON.stringify(paymentIntent.proof),
                publicSignals: JSON.stringify(paymentIntent.publicSignals),
                maxDebitAmount: props.itemData.maxPrice,
                debitTimes: props.itemData.debitTimes,
                debitInterval: props.itemData.debitInterval,
                paymentIntent: toNoteHex(paymentIntent.publicSignals[0]),
                commitment: toNoteHex(paymentIntent.publicSignals[1])

            }).then(async (status) => {
                if (status === 200) {
                    // Success is true!
                    setSuccess(true)
                    // Log out so the back button will not reload the page
                    await logoutRequest();
                    // navigate to the redirect page
                    setTimeout(() => {
                        redirectToRedirectPage(
                            props.itemData.redirectUrl,
                            toNoteHex(paymentIntent.publicSignals[0]));
                    }, 3000)
                } else {
                    setErrorMessage("Unable to save Payment Intent")
                }
            })
        }
    }

    function disableOnSubmit(e: any) {
        e.preventDefault();
        return false;
    }
    return <div class="flex flex-col p-3">
        <div class="flex flex-col flex-wrap">
        </div>
        {success ? <SuccessAnimation></SuccessAnimation> : <>
            <div class="flex flex-row justify-left mb-8 flex-wrap gap-4" >

                <div class="flex flex-row justify-center margin_0_auto">
                    <AccountCardElement
                        name={props.accountName}
                        balance={props.accountBalance}
                        currency={props.accountCurrency}
                        network={""}
                        accountType={props.accountType}
                        closed={props.closed}
                    ></AccountCardElement>

                </div>
                <form class="flex flex-col margin_0_auto" onSubmit={disableOnSubmit}>
                    <div class="mx-auto mt-4">
                        <label for="password" class="block mb-2 text-sm font-medium">Decrypt your Account with the Password</label>
                        <input
                            value={password}
                            onChange={(event: any) => setPassword(event.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            class="width-320px border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        />
                    </div>
                    <button
                        onClick={payClicked}
                        class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-700 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 indigobg"
                    >Subscribe</button>
                    <div class="w-60 mx-auto mt-4 text-center">
                        <p class={"text-red-600	"}>{errorMessage}</p>
                    </div>
                </form>
            </div>
        </>}
        <div class="bg-gray-100 border-t border-b border-gray-500 text-gray-700 px-4 py-3" role="alert">
            <p class="font-bold">Make sure you are on debitllama.com! By entering the password you accept the terms of this subsciption and prove you are the owner of this account. This is a secure page, your password and decrypted account remains confidental and never leaves the browser.</p>
            <p class="text-sm">DebitLlama does not collect or store your password or decrypted account. If you lost or forgot your account password, we can't recover it for you. You can always withdraw the account balance using the wallet that created it. By clicking Subscibe you accept to create a zero-knowledge proof that will be used to debit the payments during the subsciption period. If you wish to cancel the subsciption, you can cancel it any time using your wallet.</p>
        </div>
    </div>
}

export function SuccessAnimation() {
    return <div class="success-checkmark">
        <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
        </div>
    </div>
}