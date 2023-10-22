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

                <section class="bg-gradient-white-to-gray">
                    <div class="flex flex-col justify-center mt-10  max-w-7xl mx-auto gap-2">
                        <h1 class="text-center mx-auto text-6xl font-bold mt-2 text-gray-800 titleFontSizeOverride">Crypto Subscription</h1>
                        <h1 class="text-center mx-auto text-indigo-500 text-5xl font-bold mt-2">Payments Made Easily</h1>
                        <h2 class="mx-auto mt-3">Recurring payments without a hassle</h2>
                        <div class="flex flex-row justify-center mt-2 gap-4">
                            <a href="/login" class="font-bold w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center ">Login</a>
                            <a class="font-bold w-42  bg-gray-300 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center " href="https://medium.com/@hopeter_20531">Blog</a>
                        </div>
                    </div>
                </section>
                <section class="bg-gradient-gray-to-white-variant2">
                    <div class="flex flex-col justify-center pt-10  max-w-7xl rounded mx-auto">
                        <div class="flex flex-row justify-center rounded border shadow-lg max-w-7xl mx-auto">
                            <img alt="dashboard screenshot" width="inherit" height="inherit" class="bigScreen" src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/API_V1/static/DashboardScreenshot.png" />
                            <img alt="mobile screenshot" width="inherit" height="inherit" class="smallScreen" src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/API_V1/static/AccountScreenshot.png" />
                        </div>
                        <div class="flex flex-row justify-center mt-5">
                            <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                                <h2 class="text-5xl font-bold mt-2 text-gray-800 text-center">We have crypto direct debit!</h2>
                                <p class="whitespace-break-spaces">Externally owned accounts require you to send transactions manually. We solved this problem!</p>
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

