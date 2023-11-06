import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { getAuthenticationOptionsForAccount, getAuthenticationOptionsForLargeBlobWrite, postVerifyPasskeyRegistrationForAccount } from "../lib/frontend/fetch.ts";
import { useState } from "preact/hooks";
import { AccountAuthenticator } from "../lib/webauthn/backend.ts";
import { getRandomEncryptionPrivateKeyBlob } from "../lib/frontend/web3.ts";

export interface AddNewAccountPasskeyButtonProps {
    authenticators: Array<AccountAuthenticator>
}

export default function AddNewAccountPasskeyButton(props: AddNewAccountPasskeyButtonProps) {
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        isError: true
    })

    async function requestRegistrationOptions() {
        setNotification({
            show: false,
            message: "",
            isError: false
        })
        const res = await getAuthenticationOptionsForAccount();

        let attRes;
        const json = await res.json();
        try {
            attRes = await startRegistration(json);
        } catch (error: any) {
            console.log(error);
            if (error.name === "InvalidStateError") {
                return [
                    { commitment: "", encryptedNote: "" },
                    true,
                    "Error: Authenticator was probably already registered by user",
                    "",
                ];
            } else if (error.name === "NotAllowedError") {
                return [
                    { commitment: "", encryptedNote: "" },
                    true,
                    "Error: Authentication not allowed",
                    "",
                ];
            } else {
                return [
                    { commitment: "", encryptedNote: "" },
                    true,
                    error.message,
                    "",
                ];
            }
        }
        const clientExtensionResults = attRes.clientExtensionResults;

        //@ts-ignore largeBlob can exist in the results yes!
        const largeBlob = clientExtensionResults?.largeBlob?.supported;

        if (!largeBlob) {
            setNotification({
                show: true,
                message: "Device is not supported!",
                isError: true
            })
            return;
        }

        const registrationResponse = await postVerifyPasskeyRegistrationForAccount(attRes);

        const verificationJSON = await registrationResponse.json();

        if (!(verificationJSON && verificationJSON.success)) {
            setNotification({
                show: true,
                message: verificationJSON.error,
                isError: true
            })
            return;
        }

        // Now use the credential Id to write the account

        const resp = await getAuthenticationOptionsForLargeBlobWrite(verificationJSON.credentialID);
        const authenticationJson = await resp.json()

        if (resp.status !== 200) {
            setNotification({
                show: true,
                message: authenticationJson.error,
                isError: true
            })

            return;
        }

        if (!authenticationJson.extensions.largeBlob.write) {
            setNotification({
                show: true,
                message: "Unable to write to passkey",
                isError: true
            })
            return;
        }
        const walletBlob = getRandomEncryptionPrivateKeyBlob();
        //Add the walletBlob to the authenticationJson extension
        authenticationJson.extensions.largeBlob.write = walletBlob;

        let asseResp;
        try {
            asseResp = await startAuthentication(authenticationJson);
        } catch (err) {
            setNotification({
                show: true,
                message: "Error: Authenticator was probably already registered by user",
                isError: true
            })
            return;
        }

        //TODO: Check if writing was successful!

        //IF not then delete the authenticator from the backend!
        console.log(asseResp);
        //@ts-ignore largeBlob should exists
        const written = asseResp.clientExtensionResults.largeBlob.written;
        if (!written) {
            // SEND A REQUEST TO DELETE THE AUTHENTICATOR! writing was not a success!
        } else {
            // SUCCESS WRITTEN !
            //TODO: DO THIS!
        }
  
    }

    return <div class="flex flex-col justify-center w-full">
        <div class="text-center">
            <p class={notification.isError ? "text-red-800 text-lg" : "text-green-800 text-lg"}>{notification.show ? notification.message : ""}</p>
        </div>
        <div class="flex flex-row justify-around">
            <button aria-label="Register passkey button" onClick={requestRegistrationOptions} class="mt-2 bg-indigo-500 text-white text-xl font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300">Add new</button>
        </div>
    </div>
}
