import { useState } from 'preact/hooks';
import { ChainIds, networkNameFromId } from "../lib/shared/web3.ts";
import { PaymentIntentsTableForAccounts } from "../components/PaymentIntentsTable.tsx";
import { AccountDisplayElement } from "../components/AccountDisplayElement.tsx";

interface AccountCardCarouselProps {
    accountData: Array<any>,
    paymentIntents: Array<any>
}

function getPaymentIntentsForCurrentAccount(currentAccountCommitment: string, paymentIntents: Array<any>) {
    const filteredPi = Array<any>();
    for (let i = 0; i < paymentIntents.length; i++) {
        const p_i = paymentIntents[i];
        if (p_i.commitment === currentAccountCommitment) {
            filteredPi.push(p_i);
        }
    }
    return filteredPi;
}

export default function AccountCardCarousel(props: AccountCardCarouselProps) {
    const [currentAccount, setCurrentAccount] = useState(0);
    const [visible, setVisible] = useState(true);

    function backClicked() {
        if (currentAccount === 0) {
            if (props.accountData.length - 1 < 0) {
                return;
            }
            setVisible(false);
            setTimeout(() => {
                setCurrentAccount(props.accountData.length - 1);
                setVisible(true);
            }, 400)

        } else {
            setVisible(false);
            setTimeout(() => {
                setCurrentAccount(currentAccount - 1);
                setVisible(true);
            }, 400)

        }

    }
    function forwardClicked() {
        if (props.accountData.length - 1 === currentAccount) {
            setVisible(false);
            setTimeout(() => {
                setCurrentAccount(0);
                setVisible(true)
            }, 400)

        } else {
            setVisible(false)
            setTimeout(() => {
                setCurrentAccount(currentAccount + 1)
                setVisible(true)
            }, 400)
        }
    }

    const data = props.accountData[currentAccount];

    const currentPaymentIntents = getPaymentIntentsForCurrentAccount(data.commitment, props.paymentIntents);

    return <>
        <div class="flex flex-row justify-center gap-y-px">
            <div class={"flex flex-col justify-center"}>
                {AccountDisplayElement(
                    {
                        amount: data.balance,
                        currency: data.currency,
                        createdDate: data.created_at,
                        networkName: networkNameFromId[data.network_id as ChainIds],
                        networkId: data.network_id,
                        commitment: data.commitment,
                        name: data.name,
                        extraCSS: visible ? "fade-in-element" : "fade-out-element"
                    })}
                <div class="flex flex-rw justify-center">

                    <label onClick={backClicked}
                        class="cursor-pointer bg-white rounded-full shadow-md active:translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
                        </svg>
                    </label>

                    <label onClick={forwardClicked}
                        class="cursor-pointer bg-white rounded-full shadow-md active:translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                    </label>
                </div>
            </div>
        </div>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <h1 class="text-2xl font-bold mb-5 text-center">Payment Intents</h1>
        <section class="container px-4 mx-auto">
            <PaymentIntentsTableForAccounts paymentIntentData={getPaymentIntentsForCurrentAccount(data.commitment, currentPaymentIntents)}></PaymentIntentsTableForAccounts>
        </section>
    </>
}