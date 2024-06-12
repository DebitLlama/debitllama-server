import { ChangingTitlePart } from "../../islands/landingpage/changingTitle.tsx";
import { ContactUsForm } from "../../islands/landingpage/contactUsForm.tsx";

export function HeaderRow() {
    return <div class="flex flex-row flex-wrap gap-2 justify-between p-2 border-b shadow">
        <div class="flex flex-col">
            <div class="text-2xl  ml-1 font-bold flex flex-row">
                <img alt="debitllama logo" src="/logo.svg" width="45" height="45" class={"mr-3"} />{" "}
                <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
            </div>
        </div>
    </div>
}

export function HeaderRowWithLogin() {
    return <div class="flex flex-row flex-wrap gap-2 justify-between p-2 border-b shadow">
        <div class="flex flex-col">
            <div class="text-2xl  ml-1 font-bold flex flex-row">
                <img alt="debitllama logo" src="/logo.svg" width="45" height="45" class={"mr-3"} />{" "}
                <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
            </div>
        </div>
        <a href="/login" class="font-bold w-42  indigobg focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg  px-5 py-2.5 text-center ">
            Log in
        </a>
    </div>
}

export function FeatureMarquee() {
    return <div class="flex flex-col justify-center rounded mx-auto">
        <div class="flex flex-row justify-center">
            <div class="marquee-horizontal">
                <div class="track-horizontal" aria-hidden="true">
                    <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">{"                   "}</span>
                    <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Wallet Abstractions</span>
                    <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Distributed Intent Solvers</span>
                    <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Zero-Knowledge Proofs</span>
                    <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Meta-Transactions</span>

                </div>
            </div>
        </div>
    </div>
}

export function MainTitleSection() {
    return <section class="bg-gradient-white-to-gray overflow-hidden">
        <div class="flex flex-col justify-center mt-10  max-w-7xl mx-auto gap-2">
            <h1 class="text-center mx-auto text-6xl font-bold mt-2 text-gray-800 titleFontSizeOverride">Crypto Subscription</h1>
            <h1 class="animate-ping text-center mx-auto text-indigo-500 text-xl font-bold mt-2">Payments Made Easily</h1>
            <h2 class="mx-auto mt-3 text-2xl text-center">Recurring crypto payments with ZKP</h2>
            <div class="flex flex-row justify-center mt-2 gap-4">
                <a href="/login" class="font-bold w-42 text-white bg-indigo-800 indigobg hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-4xl px-5 py-2.5 text-center ">
                    LOG IN
                </a>
                <a class="font-bold w-42  bg-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-4xl px-5 py-2.5 text-center " href="https://medium.com/@hopeter_20531">Blog</a>
            </div>
        </div>
    </section>
}



export function MakePaymentsInfoSection() {
    return <section class="bg-gradient-gray-to-white-variant2">
        <div class="flex flex-col justify-center pt-10  max-w-7xl rounded mx-auto">
            <div class="flex flex-row justify-center rounded-lg max-w-7xl mx-auto">
                <img alt="cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./cyberpunkllama2.webp" />
                <img alt="cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./cyberpunkllama2.webp" />
            </div>
            <div class="flex flex-row justify-center mt-5">
                <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                    <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Make payments using direct debit!</h2>
                    <p class="whitespace-break-spaces text-center text-2xl">Crypto Wallets require you to send transactions manually. We solved this problem!</p>
                </div>
            </div>
        </div>
    </section>
}

export function ScalableIntentSolversInfoSection() {
    return <section>
        <div class="flex flex-col justify-center pt-10  rounded mx-auto">
            <div class="flex flex-row justify-center rounded-lg  mx-auto">
                <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./cyberpunkllamas4.webp" />
                <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./cyberpunkllamas4.webp" />
            </div>
            <div class="flex flex-row justify-center">
                <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                    <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Scalable Intent Solvers</h2>
                    <p class="whitespace-break-spaces text-center text-2xl">Let us worry about transactions. You just set it and forget it!</p>
                    <h3 class="text-center font-bold">Operating at 1010 TPS and Ready to Scale</h3>
                </div>
            </div>
        </div>
    </section>
}

export function BuiltWithInfoSection() {
    return <section>
        <div class="flex flex-row justify-center">
            <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center animate-bounce">Built with</h2>
        </div>
        <div class="flex flex-col justify-center">
            <div class="flex-horizontal">
                <div class="marquee">
                    <div class="marquee-cover"></div>
                    <div class="track-vertical">
                        <div class="flex-vertical-marquee-fix">
                            <div class="icon-container">
                                <img src="./denologo.svg" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>
                            <div class="icon-container">
                                <img src="./supabase-logo-icon.svg" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>
                            <div class="icon-container">
                                <img src="./fresh-logo.svg" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>
                        </div>
                    </div>

                </div>
                <div class="marquee">
                    <div class="marquee-cover"></div>
                    <div class="track-vertical">
                        <div class="flex-vertical-marquee-fix">
                            <div class="icon-container flex flex-col">
                                <img src="./soliditylogo.svg" width="50px" />
                                <h3 class="text-2xl font-bold">Solidity</h3>
                            </div>
                            <div class="spacer30-xsvp"></div>
                            <div class="icon-container">
                                <img src="./circom-logo-black.png" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>
                            <div class="icon-container">
                                <img src="./Typescript_logo.png" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>

                        </div>
                    </div>

                </div>
                <div class="marquee">
                    <div class="marquee-cover"></div>
                    <div class="track-vertical">
                        <div class="flex-vertical-marquee-fix">
                            <div class="icon-container">
                                <img src="./MetaMask_Icon_Color.svg" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>
                            <div class="icon-container">
                                <img src="./Webauthn_logo.png" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>
                            <div class="icon-container">
                                <img src="./coins/usdt.svg" width="200px" />
                            </div>
                            <div class="spacer30-xsvp"></div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="flex flex-row justify-center mb-5">
            <h2 class="text-2xl font-bold mt-2 text-gray-800 text-center">Cutting edge technologies to create some exciting new features!</h2>
        </div>
    </section>
}

export function NonInteractivePaymentsInfoSection() {
    return <section class="bg-gradient-gray-to-white-variant2">
        <div class="flex flex-col justify-center pt-10  max-w-7xl rounded mx-auto">
            <div class="flex flex-row justify-center rounded-lg  max-w-7xl mx-auto">
                <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./cyberpunkllama1.webp" />
                <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./cyberpunkllama1.webp" />
            </div>
            <div class="flex flex-row justify-center mt-5">
                <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                    <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Non-Interactive Payments</h2>
                    <p class="whitespace-break-spaces text-center text-2xl">Set up your account once and approve subscription payments using any browser!</p>
                    <p class="whitespace-break-spaces text-center text-lg text-gray-400">We charge a 🚘 5% fee on direct debit to cover the ⛽ Gas Fees!!</p>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center rounded mx-auto">
            <div class="flex flex-row justify-center">
                <div class="marquee-horizontal">
                    <div class="track-horizontal" aria-hidden="true">
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">{"    "}</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Deposit Accounts!</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Connect External Wallet!</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Use Metamask</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Use a Password</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Use a Passkey</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">ERC-20 Tokens</span>
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 indgobg text-center">Payment Intents</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
}

export function MultipleSecurityLayersInfoSection() {
    return <section class="bg-gradient-gray-to-white-variant2">
        <div class="flex flex-col justify-center max-w-7xl rounded mx-auto">

            <div class="flex flex-row justify-center">
                <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                    <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Multiple security layers!</h2>
                    <p class="whitespace-break-spaces text-center text-2xl mt-5"></p>
                    <div class="flex flex-row justify-center rounded-lg  max-w-7xl mx-auto">
                        <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./llama6.webp" />
                        <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./llama6.webp" />
                    </div>
                </div>
            </div>
        </div>


        <div class="container mx-auto mx-auto p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg border p-4">
                    <img src="./getOffMyPorch.webp" alt="Placeholder Image" class="w-full h-48 rounded-md object-cover" />
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Non-custodial</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Your funds are always stored securely in your External Wallet or deposited into a Smart Contract!
                            <br />
                            You can withdraw your deposit or disconnect your wallet any time. Doing so will cancel all your pending subscriptions too!
                            <br />
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <img src="./fishingPerson.webp" alt="Placeholder Image" class="w-full h-48 rounded-md object-cover" />
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl mb-2">Phishing Resistant!</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Add a Passkey to protect yourself from Phishing and protect your Accounts!
                            <br />
                            W3C standard 2FA, available in all browsers and mobile devices!
                            <br />
                            Hardware authenticator devices are supported!
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <img src="./animecoins.webp" alt="Placeholder Image" class="w-full h-48 rounded-md object-cover" />
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Spending Limit</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Spending can be controlled in both the Accounts and Subscriptions!
                            Account balance is controlled via manual deposit or ERC-20 Approvals!
                            Subscription debit limit is limited on the cryptography level! Never get charged suprise fees!
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <img src="llama5_crop.webp" alt="Placeholder Image" class="w-full h-48 rounded-md object-cover" />
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Payments secured by ZKP</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Your subscription parameters are immutable, once they are created they can't be altered only cancelled.
                            <br />
                            Payment Intent proofs are trustlessly processed by approved relayers!
                            <br />
                            Powered by a Groth-16 Snark Proving System!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
}

export function SimpleCheckoutFlowInfoSection() {
    return <section class="bg-gradient-white-to-gray">
        <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
            <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Simple Checkout Flow</h2>
            <p class="whitespace-break-spaces text-center text-2xl">Link to the checkout page or embedd the button</p>
        </div>
        <div class="flex flex-row justify-around gap-5 mt-10  max-w-7xl mx-auto bg-gray-200 pt-10 pb-10">
            <div class="flex flex-row justify-around max-w-7xl flex-wrap gap-4">
                <div class="flex flex-col justify-center text-center">
                    <div class="flex flex-row justify-center rounded-lg  mx-auto">
                        <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./llama7.webp" />
                        <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./llama7.webp" />
                    </div>
                    <h2 class="text-4xl font-bold text-gray-800 text-gradient-gray-to-white">Easy merchant integration!</h2>
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
        </div>
    </section>
}

export function OpenApiToCustomPaymentsInfoSection() {
    return <section>
        <div class="flex flex-col justify-center pt-10  rounded mx-auto">
            <div class="flex flex-row justify-center rounded-lg  mx-auto">
                <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./llama8.webp" />
                <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./llama8.webp" />
            </div>
            <div class="flex flex-row justify-center">
                <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                    <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Open API to Automate Custom Payments</h2>
                    <p class="whitespace-break-spaces text-center text-2xl">Fixed priced subscriptions are processed automatically but Dynamic payments need to be triggered using the API!</p>
                    <div class="p-4 shadow-lg rounded-xl">
                        <h3 class="text-center font-bold text-3xl">Implement Pay as You Go for your SaaS, IaaS etc...</h3>
                    </div>
                </div>
            </div>
        </div>
    </section>
}

export function LearnMoreInfoSection() {
    return <section class="bg-gradient-gray-to-white">
        <div class="flex flex-row justify-around gap-5 pt-10 pb-10 mx-auto bg-white">
            <div class="flex flex-row justify-around max-w-7xl flex-wrap gap-4">
                <div class="flex flex-col justify-center">
                    <h1 class="text-center mx-auto text-4xl font-bold mt-2 text-gray-800 ">Learn more about how it works</h1>
                </div>
                <div class="flex flex-col justify-center">
                    <img src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/master/static/explainerLlama.png" alt="explainerLlamaPic" width="100px" height="100px" class="mx-auto" />

                    <a href="https://debitllama.gitbook.io/debitllama/" class="font-bold h-12 w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Read the Docs </a>
                </div>
            </div>
        </div>
    </section>
}

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
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900 "><ChangingTitlePart ></ChangingTitlePart><span class="blinkStepStart">|</span></h2>

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
                        <div class="font-bold text-xl">Non-custodial</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Your funds are always stored securely in your External Wallet or deposited into a Smart Contract.
                            <br />
                            You can withdraw your deposit or disconnect your wallet any time. Doing so will cancel all your pending subscriptions too.
                            <br />
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl mb-2">Phishing Resistant</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Add a Passkey to protect yourself from Phishing and protect your Accounts.
                            <br />
                            W3C standard 2FA, available in all browsers and mobile devices.
                            <br />
                            Hardware authenticator devices are also supported.
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Fine tuned spending</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Account balance is controlled via manual deposit or ERC-20 Approvals and offers the same security as virtual credit cards.
                            <br />
                            Subscription debit limit is controlled on the cryptography level. Never get charged suprise fees.
                        </p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                    <div class="px-1 py-4">
                        <div class="font-bold text-xl">Payments secured by ZKP</div>
                        <p class="text-gray-700 text-base tracking-wide	leading-loose">
                            Your subscription parameters are immutable, once they are created they can't be altered only cancelled.
                            <br />
                            Payment Intent proofs are trustlessly processed by approved relayers.
                            <br />
                            Powered by a Groth-16 Snark Proving System!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
}


export function FeesInfoSection() {
    return <section class="mt-5">
        <div class="flex flex-col justify-center pt-2  max-w-7xl rounded mx-auto">

            <div class="flex flex-row justify-center mt-5">
                <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                    <h2 class="text-2xl font-bold mt-2 text-gray-800 text-center">Non-Interactive Payments</h2>
                    <p class="whitespace-break-spaces text-center text-2xl">Set up your account once and approve payments from it on any device.</p>
                    <p class="whitespace-break-spaces text-center text-lg text-gray-400">We charge a 🚘 5% fee on direct debit to cover the ⛽ Gas Fees!!</p>
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
                        <span class="marquee-text text-xl font-bold mt-2 text-indigo-800 text-center">Deposit Accounts</span>
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

