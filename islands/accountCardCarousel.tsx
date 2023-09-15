import { useState } from 'preact/hooks';
import { ChainIds, networkNameFromId, walletCurrency } from "../lib/shared/web3.ts";
import { AccountDisplayElement } from "../components/AccountDisplayElement.tsx";
import { parseEther } from "../lib/frontend/web3.ts";
import { formatEther } from "../ethers.min.js";
import { CarouselButtons } from '../components/components.tsx';
import { Pricing } from '../lib/enums.ts';
import PaymentIntentsPaginationForAccounts from './pagination/PaymentIntentsPaginationForAccounts.tsx';

interface AccountCardCarouselProps {
    accountData: Array<any>,
    missedPayments: Array<any>
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

    if (data === undefined) {
        return <div></div>
    }

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
                        extraCSS: visible ? "fade-in-element" : "fade-out-element",
                        accountType: data.accountType,
                        closed: data.closed
                    })}
                {props.accountData.length < 2 ? null : <CarouselButtons backClicked={backClicked} forwardClicked={forwardClicked}></CarouselButtons>}
                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            </div>
        </div>
        <MissedPaymentsNotification chainId={data.network_id} missedPayments={getPaymentIntentsForCurrentAccount(data.commitment, props.missedPayments)}></MissedPaymentsNotification>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <section class="container px-4 mx-auto">
            <PaymentIntentsPaginationForAccounts accountId={data.id}></PaymentIntentsPaginationForAccounts>
        </section>
    </>
}

interface MissedPaymentsNotificationProps {
    missedPayments: Array<any>;
    chainId: ChainIds
}

function MissedPaymentsNotification(props: MissedPaymentsNotificationProps) {

    if (props.missedPayments.length === 0 || props.missedPayments === null) {
        return null;
    }

    const missedPaymentsSum = props.missedPayments.reduce((acc, currentValue) => {
        if (currentValue.pricing === Pricing.Fixed) {
            return acc + parseEther(currentValue.maxDebitAmount)
        } else {
            return acc + parseEther(currentValue.failedDynamicPaymentAmount)
        }
    }, parseEther("0"))

    return <>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class={`mx-auto max-w-sm mb-4 border-solid border-2 border-red-600 flex flex-col justify-center`}>
            <div><h4 class="text-xl mx-auto text-center">{"Missed Payments!"}</h4></div>
            <p class="p-5 text-center">Your account missed {props.missedPayments.length} {props.missedPayments.length === 1 ? `payment` : `payments`}!</p>
            <p class="p-5 text-center">Top up your account with at least {formatEther(missedPaymentsSum)} {walletCurrency[props.chainId]}</p>
        </div>
    </>
}