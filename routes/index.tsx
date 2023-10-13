import { Head } from "$fresh/runtime.ts";
import { Tooltip, UnderlinedTd } from "../components/components.tsx";

export default function Home() {
    return <>
        <Head>
            <title>DebitLlama</title>
            <link rel="stylesheet" href="/home.css" />
            <link rel="stylesheet" href="/styles.css" />
        </Head>

        <div>
            <div class="flex flex-row flex-wrap gap-2 justify-between p-2 border-b shadow">
                <div class="flex flex-col">
                    <div class="text-2xl  ml-1 font-bold flex flex-row">
                        <img src="/logo.svg" width="45" class={"mr-3"} />{" "}
                        <span class="mt-1">Debit</span><span class="text-gray-600 mt-1">Llama</span>
                    </div>
                </div>
            </div>


            <section class="flex flex-col justify-center mt-10 bg-gradient-white-to-gray max-w-7xl mx-auto">
                <h1 class="text-center mx-auto text-6xl font-bold mt-2 text-gray-800">Crypto Subscription</h1>
                <h1 class="text-center mx-auto text-indigo-500 text-5xl font-bold mt-2">Payments Made Easily</h1>
                <h2 class="mx-auto text-gray-500 mt-3">Recurring payments without a hassle</h2>
                <div class="flex flex-row justify-center mt-2 gap-2">
                    <a href="/login" class="font-bold w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center ">Login</a>
                    <a class="font-bold w-42  bg-gray-300 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center " href="https://medium.com/@hopeter_20531">Blog</a>
                </div>
            </section>

            <section class="flex flex-col justify-center pt-10 bg-gradient-gray-to-white-variant2 max-w-7xl rounded mx-auto">
                <div class="flex flex-row justify-center rounded border shadow-lg max-w-7xl mx-auto">
                    <img class="bigScreen" src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/API_V1/static/DashboardScreenshot.png" />
                    <img class="smallScreen" src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/API_V1/static/AccountScreenshot.png" />
                </div>
                <div class="flex flex-row justify-center mt-5">
                    <div class="flex flex-col flex-wrap justify-around flex-wrap  p-8 rounded max-w-7xl">
                        <h2 class="text-xl font-bold mt-2 text-gray-800 text-center">We have crypto direct debit!</h2>
                        <p class="text-gray-600 whitespace-break-spaces">Externally owned accounts require you to send transactions manually. We solved this problem!</p>
                    </div>
                </div>
            </section>
            <hr class="border max-w-7xl mx-auto" />
            <section class="flex flex-row justify-center mt-10 bg-gradient-white-to-gray max-w-7xl mx-auto">
                <div class="flex flex-row justify-around max-w-7xl flex-wrap gap-4">
                    <div class="flex flex-col justify-center text-center">
                        <h2 class="text-4xl font-bold text-gray-800 text-gradient-gray-to-white">Easy merchant integration</h2>
                        <div class="flex flex-row justify-center mt-2">
                            <img src="/buyitnow.png" width="150px" />
                        </div>

                    </div>

                    <div class="overflow-scroll bg-gray-800 shadow-2xl rounded-lg overflow-hidden max-w-xl w-80	">
                        <div id="header-buttons" class="py-3 px-4 flex">
                            <div class="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                            <div class="rounded-full w-3 h-3 bg-green-500 mr-2"></div>
                            <p class="text-xs text-white">Embed the buy Button on your Website </p>
                        </div>
                        <div class="py-4 px-4 mt-1 text-white overflow-auto">
                            <pre class="text-sm">
                                {`<a href="https://debitllama.com/buyitnow/?q=<IDENTIFIER>"><img width="140px" src="https://debitllama.com/buyitnow.png"/></a>`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            <section class="flex flex-col justify-center pt-10 bg-gradient-gray-to-white max-w-7xl mx-auto">

                <div class="flex flex-row justify-center text-center pb-5">
                    <h2 class="text-4xl font-bold text-gray-800 ">Free to use! Transaction fees only!</h2>
                </div>
                <div class="flex flex-row justify-center mt-2">
                    <a href="https://debitllama.gitbook.io/debitllama/" class="font-bold w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">How we compare to others?</a>
                </div>
                <div class="flex flex-row justify-center text-center pb-5 mt-5">
                    <h2 class="text-xl font-bold text-gray-800 ">Subscriptions are set it and forget it or you can cancel any time!</h2>
                </div>
                <div class={"flex flex-row justify-center"}>
                    <img src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/dea5a287be9c210698396f3bd0522158cd243974/static/PaymentsImage.svg" width="400px" />
                </div>
            </section>

            <section class="flex flex-col justify-center bg-gradient-gray-to-white max-w-7xl mx-auto">
                <div class="flex flex-row justify-center">
                    <div class={"w-full flex flex-row justify-around flex-wrap gap-2 bg-gray-50 rounded m-8 max-w-7xl pt-10 pl-10 pr-10"}>
                        <h1 class="text-center mx-auto text-4xl font-bold mt-2 text-gray-800">See the docs to learn more</h1>
                        <div class="flex flex-row justify-center mt-2">
                            <a href="https://debitllama.gitbook.io/debitllama/" class="font-bold w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Read the Docs</a>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row justify-center mb-5">
                    <h3 class="text-center text-lg">
                        We use cutting edge Zero-knowledge proof technology to make subsciption payments happen securely!
                    </h3>
                </div>
            </section>
        </div >
    </>
}