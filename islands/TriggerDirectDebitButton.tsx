import { parseEther } from "../lib/frontend/web3.ts";
import { PaymentIntentRow, PaymentIntentStatus } from "../lib/enums.ts";
import { ChainIds } from "../lib/shared/web3.ts";
import { useState } from 'preact/hooks';
import { requestDynamicPayment } from "../lib/frontend/fetch.ts";

export interface TriggerDirectDebitButtonProps {
    chainId: ChainIds;
    paymentIntent: PaymentIntentRow;
    transactionsLeft: number;
}

export default function TriggerDirectDebitButton(props: TriggerDirectDebitButtonProps) {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [requestedAmount, setRequestedAmount] = useState("0");

    const handleError = (msg: string) => {
        setShowError(true);
        setErrorMessage(msg)
    }

    async function dynamicPaymentTrigger() {
        setShowError(false);

        if (props.transactionsLeft === 0) {
            handleError("Payment Intent already completed!")
            return;
        }

        if (props.paymentIntent.statusText === PaymentIntentStatus.CANCELLED) {
            handleError("Payment Intent Already Cancelled");
            return;
        }

        if (isNaN(parseFloat(requestedAmount))) {
            handleError("Invalid input");
            return;
        }

        if (parseEther(requestedAmount) > parseEther(props.paymentIntent.maxDebitAmount)) {
            handleError("Request exceeds maximum amount!");
            return;
        }

        if (props.paymentIntent.nextPaymentDate !== null &&
            new Date().getTime() < new Date(props.paymentIntent.nextPaymentDate).getTime()) {
            // If next payment date is set, I check if the current date exceeds it or not.
            // If not, then it might be too early to send this transaction and it would fail...
            handleError("Payment not due! Check next payment date. If you try to debit too early the transaction will fail!");
            return;
        }

        const response = await requestDynamicPayment({
            paymentIntent: props.paymentIntent.paymentIntent,
            chainId: props.chainId,
            requestedDebitAmount: requestedAmount
        }).catch((err) => {
            handleError("Unable to send request!")
        });
        if (response === null || response === undefined) {
            return;
        }
        if (response.status === 200) {
            location.reload();
        } else {
            // failed and I need to show the error message!
            const json = await response.json();
            handleError(json.error)
        }
    }


    return <div class="flex flex-col justify-center">
        {props.paymentIntent.statusText === PaymentIntentStatus.CANCELLED ? <p class="text-sm text-red-500">Payment Intent Cancelled!</p> :
            <div class={"flex flex-col justify-center"}>
                <input required class="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    value={requestedAmount} onChange={(event: any) => setRequestedAmount(event.target.value)} type="number" id="requestedAmount" name="requestedAmount" placeholder="Debit" />
                <button
                    disabled={props.paymentIntent.statusText === PaymentIntentStatus.CANCELLED}
                    class="bg-gradient-to-b w-max text-green-500 font-semibold from-slate-50 to-green-100 px-10 py-3 rounded-2xl shadow-green-400 shadow-md border-b-4 hover border-b border-green-200 hover:shadow-sm transition-all duration-500"
                    onClick={dynamicPaymentTrigger}
                >Debit</button>
            </div>}

        <p class="text-sm text-red-500">{showError ? errorMessage : ""}</p>

    </div>
}