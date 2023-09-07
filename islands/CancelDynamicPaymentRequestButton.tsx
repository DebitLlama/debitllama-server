import { PaymentIntentRow, PaymentIntentStatus } from "../lib/enums.ts";
import { cancelDynamicPaymentRequest } from "../lib/frontend/fetch.ts";
import { ChainIds } from "../lib/shared/web3.ts";
import { useState } from 'preact/hooks';

export interface CancelDynamicPaymentRequestButtonProps {
    chainId: ChainIds;
    paymentIntent: PaymentIntentRow;
    dynamicPaymentRequest: any
}

export default function CancelDynamicPaymentRequestButton(props: CancelDynamicPaymentRequestButtonProps) {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function cancelDynamicPayment() {
        setShowError(false);
        const response = await cancelDynamicPaymentRequest({ dynamicPaymentRequestId: props.dynamicPaymentRequest.id }).catch(err => {
            setErrorMessage("Unable to reach the server!")
            setShowError(true);
        });

        if (!response) {
            return;
        }

        const json = await response.json();

        if (response.status === 200) {
            location.reload();
        } else {
            setErrorMessage(json.error);
            setShowError(true)

        }
    }


    return <div class="flex flex-col justify-center">
        {props.paymentIntent.statusText === PaymentIntentStatus.CANCELLED ? <p class="text-sm text-red-500">Payment Intent Cancelled!</p> :
            <div class={"flex flex-col justify-center"}>
                <button
                    disabled={props.paymentIntent.statusText === PaymentIntentStatus.CANCELLED}
                    class="bg-gradient-to-b w-max text-slate-500 font-semibold from-slate-50 to-slate-100 px-10 py-3 rounded-2xl shadow-slate-400 shadow-md border-b-4 hover border-b border-slate-200 hover:shadow-sm transition-all duration-500"
                    onClick={cancelDynamicPayment}
                >Cancel</button>
            </div>}

        <p class="text-sm text-red-500">{showError ? errorMessage : ""}</p>

    </div>

}