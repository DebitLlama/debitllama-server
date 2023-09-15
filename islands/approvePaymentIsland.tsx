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

    return <div class="flex flex-col p-3">
        <div class="flex flex-col flex-wrap">
        </div>
        {success ? <SuccessAnimation></SuccessAnimation> : <>
            <div class="flex flex-row justify-center">
                <AccountCardElement
                    name={props.accountName}
                    balance={props.accountBalance}
                    currency={props.accountCurrency}
                    network={""}
                    accountType={props.accountType}
                    closed={props.closed}
                ></AccountCardElement>

            </div>
            <div class="w-60 mx-auto mt-4">
                <label for="password" class="block mb-2 text-sm font-medium">Account Password</label>
                <input value={password} onChange={(event: any) => setPassword(event.target.value)} type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
            </div>
            <div class="w-60 mx-auto mt-4 text-center">
                <p class={"text-red-600	"}>{errorMessage}</p>
            </div>
            <button
                onClick={payClicked}
                class="w-60 mb-4 mt-4 mx-auto text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg text-2xl font-bold px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Subscribe</button></>}
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