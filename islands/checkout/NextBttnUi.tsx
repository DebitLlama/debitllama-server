import { useState } from "preact/hooks";
import { NextIcon } from "../../components/Checkout/Icons.tsx";
import { getAuthenticationOptionsForCheckout } from "../../lib/frontend/fetch.ts";
import { startAuthentication } from "@simplewebauthn/browser";

export function NextBttnUi(props: {
    buttonId: string,
    commitment: string,
    requires2FA: boolean,
}) {
    const [TwoFaStarted, setTwoFaStarted] = useState(false);
    const [verificationOptions, setVerificationOptions] = useState("");
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        isError: false
    });

    //Check if the 2FA is required
    if (props.requires2FA && !TwoFaStarted) {
        // If 2 FA is required, render a different button and not the form
        // Then get the verification options

        // Then rerender the form and do the post, add the 2FA to the form post hidden input!!
        const verifyPasskey = async () => {
            setNotification({
                show: false,
                message: "",
                isError: false
            })
            const optionsResp = await getAuthenticationOptionsForCheckout();

            let asseResp;

            try {
                asseResp = await startAuthentication(await optionsResp.json());
            } catch (err) {
                setNotification({
                    show: true,
                    message: "Unable to start Authentication",
                    isError: true
                })
                return;
            }
            // Stringify the response and add to the verificationOptions 
            setVerificationOptions(JSON.stringify(asseResp));
            setTwoFaStarted(true)
            setTimeout(() => {
                // After 2 seconds passed, click on the Finish checkout button!
                document.getElementById("finish_checkout")?.click();
            }, 2000);

        }

        return <div class="flex p-3 rounded-xl">
            <button
                aria-label={"Passkey authentication button"}
                onClick={verifyPasskey}
                class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-700 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 indigobg">
                <div class="flex flex-col justify-center">
                    <p>Passkey Authentication Required</p>
                </div>
            </button>
        </div>
    }


    return <div class="flex p-3 rounded-xl">
        <form
            class={"mx-auto w-full"}
            action={"app/approvepayment"}
            method={"POST"}
        >
            <input type="hidden" value={props.buttonId} name="debititem" />
            <input type="hidden" value={props.commitment} name="accountcommitment" />
            <input type="hidden" value={verificationOptions} name="verificationOptions" />
            <button
            aria-label={"Finish checkout button"}
                id="finish_checkout"
                type={"submit"}
                class="w-full flex flex-row justify-center text-xl font-bold mb-4 mt-4 text-white bg-indigo-700 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 rounded-lg px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 indigobg">
                <div class="flex flex-col justify-center">
                    <p class="text-2xl">Finish Checkout</p>
                </div>
                <div class="flex flex-col justify-center">
                    <NextIcon width={"30px"} />
                </div>
            </button>
        </form>
    </div>
}

