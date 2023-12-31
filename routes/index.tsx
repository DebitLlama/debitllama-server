import { Head } from "$fresh/runtime.ts";
import SlacKInviteForm from "../components/SlackInviteForm.tsx";

export default function Home() {
    return <>
        <html lang="en">
            <Head>
                <title>DebitLlama</title>
                <link rel="stylesheet" href="/home.css" />
                <link rel="stylesheet" href="/styles.css" />
                <meta name="description" content="DebitLlama - Subscription Payments" />
            </Head>

            <div>
                <div class="flex flex-row flex-wrap gap-2 justify-between p-2 border-b shadow">
                    <div class="flex flex-col">
                        <div class="text-2xl  ml-1 font-bold flex flex-row">
                            <img alt="debitllama logo" src="/logo.svg" width="45" height="45" class={"mr-3"} />{" "}
                            <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col justify-center rounded mx-auto">
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


                <section class="bg-gradient-white-to-gray overflow-hidden">
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
                <section class="bg-gradient-gray-to-white-variant2">
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



                <section>
                    <div class="flex flex-col justify-center pt-10  rounded mx-auto">
                        <div class="flex flex-row justify-center rounded-lg  mx-auto">
                            <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./cyberpunkllamas4.webp" />
                            <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./cyberpunkllamas4.webp" />
                        </div>
                        <div class="flex flex-row justify-center">
                            <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                                <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Scalable Intent Solvers</h2>
                                <p class="whitespace-break-spaces text-center text-2xl">Let us worry about transactions. You just set it and forget it!</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
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

                <section class="bg-gradient-gray-to-white-variant2">
                    <div class="flex flex-col justify-center pt-10  max-w-7xl rounded mx-auto">
                        <div class="flex flex-row justify-center rounded-lg  max-w-7xl mx-auto">
                            <img alt="another cyberpunk llama image" width="inherit" height="inherit" class="bigScreen indigobg" src="./cyberpunkllama1.webp" />
                            <img alt="another cyberpunk llama image mobile" width="inherit" height="inherit" class="smallScreen indigobg " src="./cyberpunkllama1.webp" />
                        </div>
                        <div class="flex flex-row justify-center mt-5">
                            <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                                <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">Non-Interactive Payments</h2>
                                <p class="whitespace-break-spaces text-center text-2xl">Set up your account once and approve subscription payments using any browser!</p>
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


                <section class="bg-gradient-gray-to-white-variant2">
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
                                    <p class="text-gray-700 text-base">
                                        Your funds are always stored securely in your EOA or a Smart Contract!
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
                                    <p class="text-gray-700 text-base">
                                        Add a Passkey to protect yourself from Phishing and Account takeovers!
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
                                    <p class="text-gray-700 text-base">
                                        Spending can be controlled with both the Accounts and Subscriptions!
                                        Account balance is controlled via manual deposit or ERC-20 Approvals!
                                        Subscription debit limit is limited on the cryptography level! Never get charged suprise fees!
                                    </p>
                                </div>
                            </div>
                            <div class="bg-white rounded-lg border p-4">
                                <img src="llama5_crop.webp" alt="Placeholder Image" class="w-full h-48 rounded-md object-cover" />
                                <div class="px-1 py-4">
                                    <div class="font-bold text-xl">Payments secured by ZKP</div>
                                    <p class="text-gray-700 text-base">
                                        Your subscription parameters are immutable, once it's created it can't be altered!
                                        <br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>

                <section class="bg-gradient-white-to-gray">
                    <div class="flex flex-row justify-around gap-5 mt-10  max-w-7xl mx-auto bg-gray-200 pt-10 pb-10">
                        <div class="flex flex-row justify-around max-w-7xl flex-wrap gap-4">
                            <div class="flex flex-col justify-center text-center">
                                <h2 class="text-4xl font-bold text-gray-800 text-gradient-gray-to-white">Easy merchant integration!</h2>
                                <div class="flex flex-row justify-center mt-2">
                                    <img alt="Buy It Now with DebitLlama" src="/buyitnow.png" width="150px" height="inherit" />
                                </div>
                            </div>

                            <div class="overflow-auto bg-gray-800 shadow-2xl rounded-lg codeDisplayWidth">
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

                <section class="bg-gradient-white-to-gray pb-10 ">
                    <SlacKInviteForm></SlacKInviteForm>
                </section>


                <section class="bg-gradient-gray-to-white">
                    <div class="flex flex-row justify-around gap-5 pt-10 pb-10 max-w-7xl mx-auto bg-white">
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
            </div >
        </html>
    </>
}

