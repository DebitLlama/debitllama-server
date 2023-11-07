import { AccountCardElement } from "../components/AccountCardElement.tsx";
import { AccountAccess, AccountTypes } from "../lib/enums.ts";
import { createPaymentIntent, toNoteHex } from "../lib/frontend/directdebitlib.ts";
import { logoutRequest, redirectToRedirectPage, uploadPaymentIntent } from "../lib/frontend/fetch.ts";
import { parseEther, switch_recoverAccount } from "../lib/frontend/web3.ts";
import { useState } from 'preact/hooks';
import { ItemProps } from "../lib/types/checkoutTypes.ts";
import { ChainIds } from "../lib/shared/web3.ts";

interface ApprovePaymentIslandProps {
    cipherNote: string,
    itemData: ItemProps,
    accountcommitment: string,
    accountName: string,
    accountBalance: string,
    accountCurrency: string,
    accountType: AccountTypes,
    closed: boolean,
    account_access: AccountAccess,
    chainId: string
}


export default function ApprovePaymentIsland(props: ApprovePaymentIslandProps) {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // Sometimes the button submits the request twice for some reason. If it submitted it once I lock it so it cant do again!
    const [payClickLocked, setLockPayClicked] = useState(false);

    async function payClicked() {

        const decryptedNote = await switch_recoverAccount(
            props.account_access,
            props.cipherNote,
            password,
            props.chainId as ChainIds,
            setErrorMessage

        );

        if (decryptedNote === "") {
            setErrorMessage("Unable to decrypt account!");
            return;
        } else {
            setErrorMessage("");
            if (payClickLocked) {
                return;
            }
            setLockPayClicked(true);
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
                zkeyFilePath: "/directDebit_final.zkey"
            }
        }).catch(err => {
            console.error(err)
            setLockPayClicked(false);
            return;
        });
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
                    await logoutRequest().then(() => {
                        // navigate to the redirect page but only after we logged out!
                        setTimeout(() => {
                            redirectToRedirectPage(
                                props.itemData.redirectUrl,
                                toNoteHex(paymentIntent.publicSignals[0]));
                        }, 3000)
                    });

                } else {
                    setErrorMessage("Unable to save Payment Intent");
                    setLockPayClicked(false);
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
                    {props.account_access === "password" ?
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
                        :
                        <div class="mx-auto mt-4">
                            <label for="password" class="block mb-2 text-sm font-medium">{
                                props.account_access === AccountAccess.metamask
                                    ? "Decrypt you account using Metamask"
                                    : "Access your account using Passkey"}</label>
                        </div>
                    }
                    <button
                        aria-label="Accept this subsciption"
                        disabled={payClickLocked}
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
            <p class="font-bold">Make sure you are on debitllama.com! By entering the password you accept our <a href="/termsAndConditions" target="_blank" class="text-sm text-indigo-500">Terms and conditions</a> and the parameters of this subscription and prove you are the owner of this account. This is a secure page, your password and decrypted account remains confidental and never leaves the browser.</p>
            <p class="text-sm">DebitLlama does not collect or store your password or decrypted account. If you lost or forgot your account password, we can't recover it for you. You can always withdraw the account balance using the wallet that created it. By clicking Subscribe you accept to create a zero-knowledge proof that will be used to debit the payments during the subscription period. If you wish to cancel the subscription, you can cancel it any time using your wallet. <strong>You have 30 minutes to cancel the subscription before your account is debited!</strong></p>
            <p class="text-sm">DISCLAIMER! THE SUBSCRIPTION SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. DEBITLLAMA FURTHER DISCLAIMS ALL WARRANTIES, EXPRESS AND IMPLIED, INCLUDING WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF THE SERVICE OFFERED BY MERCHANTS IN EXCHANGE FOR PAYMENTS. DEBITLLAMA IS NOT RESPONSIBLE FOR ANY DAMAGES CAUSED OR DISPUTES THAT CAN OCCUR DUE TO THE PARTIES DISAGREEMENT CAUSED BY NON-FULFILLMENT OR CANCELLATION OF THE SUBSCRIPTION AND ITS TERMS. WE PROVIDE NO WARRANTIES AND BY SUBSCRIBING TO A SERVICE YOU AGREE TO IDEMNIFY DEBITLLAMA FROM CLAIMS DAMAGES OR LOSSES ARISING FROM ACCEPTING THIS SUBSCRIPTION.</p>
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