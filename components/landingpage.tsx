import { ChangingTitlePart } from "../islands/landingpage/changingTitle.tsx";
import { ContactUsForm } from "../islands/landingpage/contactUsForm.tsx";

export function SimpleLandingPage() {
    return <div class="bg-white">
        <header class="absolute inset-x-0 top-0 z-50">
            <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div class="flex flex-col">
                    <div class="text-2xl  ml-1 font-bold flex flex-row">
                        <img alt="debitllama logo" src="/logo.svg" width="45" height="45" class={"mr-3"} />{" "}
                        <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
                    </div>
                </div>
                <div class="lg:flex lg:flex-1 lg:justify-end">
                    <a href="/login" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</a>
                </div>
            </nav>
        </header>
        <div class="relative isolate pt-14 ">
            <div class="flex flex-row flex-wrap">

                <div class="mx-auto max-w-2xl pt-32 sm:pt-48 lg:pt-56 pb-10" >
                    <div class="text-center">
                        <h1 class="text-3xl font-bold tracking-tight text-gray-900  whitespace-pre">    Crypto subscription    </h1>
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900 "><ChangingTitlePart></ChangingTitlePart><span class="blinkStepStart">|</span></h2>

                        <p class="mt-6 text-lg leading-8 text-gray-600">Smart Contract Accounts, Wallet Abstraction, Checkout Flow</p>
                        <div class="mt-10 flex items-center justify-center gap-x-6">
                            <a href="/signup" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</a>
                            <a href="https://debitllama.gitbook.io/debitllama" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
                        </div>
                    </div>
                </div>
                <DashboardScreenshotPic></DashboardScreenshotPic>
            </div>
        </div>
        <InfoSection></InfoSection>
        <FeesInfoSection></FeesInfoSection>
        <SimpleCheckoutFlow></SimpleCheckoutFlow>
        <FooterMarquee></FooterMarquee>
    </div>
}

function DashboardScreenshotPic() {
    return <figure class="border border-8 mx-auto">
        <img class="border-slate-400" width="800px" height="auto" src="./Dashboard-Screenshot-new.webp" />
    </figure>
}

export function InfoSection() {
    return <section class="mt-10 ml-5 mr-5">
        <div class="mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl mb-2">What is DebitLlama?</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            <strong>A service for creating and managing future transactions with immutable constraints.</strong>
                            <br />
                            The service uses blockchain contracts with zero-knowledge proof cryptography that allow transactions to become valid over time until the proof is invalidated.
                            <br />
                            You can manage accounts for recurring subscription payments or become a merchant and directly debit cold wallets and pay for your customer's transaction fees.
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Non-custodial</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            <strong>There is no custody. Period. Funds are never locked or stored by third-parties.</strong>

                            Your funds are always stored securely in your <strong>External Owned Wallet</strong> or in a <strong>Smart Contract based Virtual Account</strong>
                            <br />
                            You can cancel all your subscriptions and disconnect your wallet with a single blockchain transaction any time.
                            <br />

                            DebitLlama has no access to funds and is unable to freeze or conficate deposits or alter subscriptions in any ways.
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Always in control</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            <strong>You can't get charged more than what you approved.</strong>
                            <br />
                            No surprise fees even with pay-per-usage. The maximum you can pay never changes.
                            <br />
                            Your spending limit is set on both the account and subscription level, where cryptography guarantees your subscription never exceeds the maximum approved payment amount or frequency.
                            <br />

                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Bespoke Wallet Abstractions</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            <strong>Accounts with Direct Debit Pull Payments</strong>
                            <br />
                            Meta-Transactions are trustlessly relayed by Intent Solvers.
                            <br />
                            Account creation always depends on an active wallet, but once they are created payments can be approved from them just by supplying an encryption password or passkey too, or just keep using trusty ol Metamask.
                            <br />
                            <strong>Spending approval and ownership is decoupled.</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
}


export function FeesInfoSection() {
    return <section class="mt-5 ml-5 mr-5">
        <div class="flex flex-col justify-start pt-2  max-w-7xl rounded border-8">

            <div class="flex flex-row justify-center mt-5">
                <div class="flex flex-col flex-wrap justify-around flex-wrap p-8 rounded max-w-7xl">
                    <h2 class="text-2xl font-bold mt-2 text-gray-800 text-start">Direct Debit Payments</h2>
                    <p class="whitespace-break-spaces text-start text-lg text-gray-400">The service charges a 🚘 5% fee on successful direct debit in the smart contract. Fees are subject to change. </p>
                    <p class="whitespace-break-spaces text-start text-xl">Set up your account once and approve payments from it on any device. Keep using metamask, use a password based wallet abstraction or turn a cutting-edge passkey into a wallet.</p>
                    <p>Debitllama is not a money transmitter. It does not custody funds or processes the blockchain transactions on behalf of users. It stores <strong>Intents</strong> and provides an interface to fulfill them and charges a fee for using this interface. The subscription service providers that register must process their own transactions and cover the ⛽ Gas Fees. If you want to register and sell a subscription service but don't know how to host a relayer and debit your customers, fill out the contact us form and we will get back to you shortly with hands on support.</p>
                </div>
            </div>
        </div>
    </section>
}

export function FooterMarquee() {
    return <footer>
        <div class="flex flex-col justify-center rounded mx-auto">
            <div class="flex flex-row justify-center">
                <div class="marquee-horizontal">
                    <div class="track-horizontal" aria-hidden="true">
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">{"    "}</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">DebitLlama 2023 - ${new Date().getFullYear()}</span>

                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Wallet Abstractions</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Distributed Intent Solvers</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Zero-Knowledge Proofs</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Meta-Transactions</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Single-Use Accounts</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Connect External Wallet</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Pay with Metamask</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Pay with a Password</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Pay using a Passkey</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">ERC-20 Tokens</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Payment Intents</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
}

export function SimpleCheckoutFlow() {
    return <section>
        <div class="flex flex-row flex-wrap justify-around gap-5 mt-10 mx-auto bg-gray-200 pt-10 pb-10">
            <div class="flex flex-row justify-around max-w-2xl flex-wrap gap-4 rounded shadow-md pb-2">
                <div class="flex flex-col justify-center text-center">
                    <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                        <h2 class="text-xl font-bold mt-2 text-gray-800 text-center">Simple Checkout Integration</h2>
                    </div>
                    <div class="flex flex-row justify-center mt-2">
                        <img alt="Buy It Now with DebitLlama" src="/buyitnow.png" width="150px" height="inherit" />
                    </div>
                </div>

                <div class="overflow-auto bg-gray-800 shadow-2xl rounded-lg codeDisplayWidth h-60">
                    <div id="header-buttons" class="py-3 px-4 flex">
                        <div class="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                        <div class="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                        <div class="rounded-full w-3 h-3 bg-green-500 mr-2"></div>
                        <p class="text-xs text-white">Embed the buy Button on your Website </p>
                    </div>
                    <div class="py-4 px-4 mt-1 text-white overflow-auto h-48">
                        <pre class="text-sm break-all">
                            <span class="text-yellow-500">{`<a`}</span>{"\n "}
                            <span class="text-yellow-200">href="</span>
                            <span class="">{`https://debitllama.com/buyitnow/?q=`}</span>
                            <span class="text-red-300">{`<IDENTIFIER>`}</span>
                            <span class="text-yellow-200">"</span>
                            <span class="text-yellow-500">{`>\n `}</span>
                            <span class="text-yellow-500">{`<img `}</span>
                            <span>{`\n  `}</span>
                            <span class="text-yellow-200">width="</span>
                            <span class="">{`140px`}</span>
                            <span class="text-yellow-200">"{`\n  `}</span>
                            <span class="text-yellow-200">alt="</span>
                            <span class="">{`Buy it now with DebitLlama`}</span>
                            <span class="text-yellow-200">"{`\n  `}</span>
                            <span class="text-yellow-200">src="</span>
                            <span class="">{`https://debitllama.com/buyitnow.png`}</span>
                            <span class="text-yellow-200">"</span>
                            <span class="text-yellow-500">{`/>\n`}</span>
                            <span class="text-yellow-500">{`</a>`}</span>
                        </pre>
                    </div>
                </div>
            </div>
            <ContactUsForm></ContactUsForm>
        </div>
    </section>
}

