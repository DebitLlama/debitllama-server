import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { requestNewPasskeyRegistration, postVerifyPasskeyRegistration, getAuthenticationOptionsForRevoke, verifyAuthenticationForRevoke } from "../lib/frontend/fetch.ts";
import { useState } from "preact/hooks";

export default function AddNewPassKeyButton() {

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
        const res = await requestNewPasskeyRegistration();

        let attResp;
        const json = await res.json();
        try {
            attResp = await startRegistration(json);
        } catch (error: any) {
            // Some basic error handling
            if (error.name === 'InvalidStateError') {
                setNotification({
                    show: true,
                    message: "Error: Authenticator was probably already registered by user",
                    isError: true
                })

            } else if (error.name === "NotAllowedError") {
                setNotification({
                    show: true,
                    message: "Error: Authentication not allowed",
                    isError: true
                })

            } else {
                setNotification({
                    show: true,
                    message: error.message,
                    isError: true
                })
            }

            return;
        }
        // Now Post the response to the endpoint that verifies the response
        const registrationResponse = await postVerifyPasskeyRegistration(attResp);

        const verificationJSON = await registrationResponse.json();

        if (verificationJSON && verificationJSON.success) {
            window.location.reload();
        } else {
            setNotification({
                show: true,
                message: verificationJSON.error,
                isError: true
            })
        }
    }

    async function revokeRegistrationOptions() {
        setNotification({
            show: false,
            message: "",
            isError: false
        })
        const resp = await getAuthenticationOptionsForRevoke();
        const json = await resp.json()

        if (resp.status !== 200) {
            setNotification({
                show: true,
                message: json.error,
                isError: true
            })

            return;
        }

        let asseResp;
        try {
            asseResp = await startAuthentication(json);
        } catch (err) {
            setNotification({
                show: true,
                message: "Error: Authenticator was probably already registered by user",
                isError: true
            })
            return;
        }

        // Post the response to the server again that verifies the authentication response
        const verificationResp = await verifyAuthenticationForRevoke(asseResp);
        const verificationJSON = await verificationResp.json();

        if (verificationJSON && verificationJSON.success) {
            window.location.reload();
        } else {
            setNotification({
                show: true,
                message: verificationJSON.error,
                isError: true
            })
        }
    }

    return <div class="flex flex-col justify-center w-full">
        <div class="text-center">
            <p class={notification.isError ? "text-red-800 text-lg" : "text-green-800 text-lg"}>{notification.show ? notification.message : ""}</p>
        </div>
        <div class="flex flex-row justify-around">
            <button onClick={requestRegistrationOptions} class="mt-2 bg-indigo-500 text-white text-xl font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300">Register</button>
            <button onClick={revokeRegistrationOptions} class="mt-2 bg-indigo-500 text-white text-xl font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 disabled:bg-indigo-100 transition duration-300">Remove</button>
        </div>
    </div>
}