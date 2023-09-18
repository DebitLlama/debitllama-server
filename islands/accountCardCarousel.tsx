import { useState } from 'preact/hooks';
import { ChainIds, networkNameFromId, walletCurrency } from "../lib/shared/web3.ts";
import { AccountDisplayElement } from "../components/AccountDisplayElement.tsx";
import { parseEther } from "../lib/frontend/web3.ts";
import { formatEther } from "../ethers.min.js";
import { CarouselButtons } from '../components/components.tsx';
import { AccountTypes, Pricing } from '../lib/enums.ts';
import PaymentIntentsPaginationForAccounts from './pagination/PaymentIntentsPaginationForAccounts.tsx';
import AccountsSelectButtons from './AccountsSelectButtons.tsx';

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
            setCurrentAccountWithAnimation(props.accountData.length - 1);
        } else {
            setCurrentAccountWithAnimation(currentAccount - 1);
        }
    }
    function forwardClicked() {
        if (props.accountData.length - 1 === currentAccount) {
            setCurrentAccountWithAnimation(0);
        } else {
            setCurrentAccountWithAnimation(currentAccount + 1)
        }
    }

    function setCurrentAccountWithAnimation(to: number) {
        setVisible(false)
        setTimeout(() => {
            setCurrentAccount(to)
            setVisible(true)
        }, 400)
    }

    const data = props.accountData[currentAccount];

    if (data === undefined) {
        return <div class="flex flex-col justify-center">
            <div class="flex flex-row justify-center mb-4 mt-4">
                <h4 class="text-xl">Nothing to show 🥱</h4>
            </div>
            <div class="flex flex-row justify-around flex-wrap gap-2">
                <a href={"/app/addNewAccount"} class="mb-8 bg-gradient-to-b w-max text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">New Virtual Account</a>
                <a href={"/app/newConnectedWallet"} class="mb-8 bg-gradient-to-b w-max text-indigo-500 font-semibold from-slate-50 to-indigo-100 px-10 py-3 rounded-2xl shadow-indigo-400 shadow-md border-b-4 hover border-b border-indigo-200 hover:shadow-sm transition-all duration-500">Connect Wallet</a>
            </div>
        </div>
    }

    return <div class={"negativeMarginTop10Px container border-2 bg-gradient-gray-to-white to-white rounded-lg mx-auto"}>
        <AccountsSelectButtons
            accountData={props.accountData}
            currentAccount={currentAccount}
            stateSetter={setCurrentAccountWithAnimation}
        ></AccountsSelectButtons>
        <div class="flex flex-row justify-left">
            <p class="pl-6 mb-2 text-gray-500 font-semibold text-sm">{props.accountData.length} account{props.accountData.length === 1 ? " " : "s "} found </p>
        </div>
        <div class="flex flex-row justify-center ">
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
                <hr
                    class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            </div>
        </div>
        <MissedPaymentsNotification
            accountType={data.accountType}
            chainId={data.network_id}
            missedPayments={getPaymentIntentsForCurrentAccount(data.commitment, props.missedPayments)}
            currency={data.currency}
        ></MissedPaymentsNotification>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <section class="px-4 mx-auto">
            <PaymentIntentsPaginationForAccounts accountId={data.id}></PaymentIntentsPaginationForAccounts>
        </section>
    </div>
}

interface MissedPaymentsNotificationProps {
    missedPayments: Array<any>;
    chainId: ChainIds,
    accountType: AccountTypes,
    currency: string
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

    const balanceMessage = props.accountType === AccountTypes.VIRTUALACCOUNT
        ? <p class="text-left text-red-600">Top up your account with at least {formatEther(missedPaymentsSum)} {JSON.parse(props.currency).name}</p>
        : <p class="text-left text-red-600">Deposit into your connected wallet {formatEther(missedPaymentsSum)} {JSON.parse(props.currency).name} and make sure to have enough allowance. </p>


    return <>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class={`mx-auto max-w-sm mb-4 flex flex-col justify-center`}>
            <div><h4 class="text-xl text-red-600 mx-auto text-left">{"Missed Payments!"}</h4></div>
            <p class="text-left text-red-600">Your account missed {props.missedPayments.length} {props.missedPayments.length === 1 ? `payment` : `payments`}!</p>
            {balanceMessage}
        </div>
    </>
}