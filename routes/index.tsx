import { Head } from "$fresh/runtime.ts";

export default function Home() {
    return <>
        <Head>
            <title>DebitLlama</title>
            <link rel="stylesheet" href="/home.css" />
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
            <section class="flex flex-col justify-center mt-10">
                <h1 class="text-center mx-auto text-4xl font-bold mt-2 text-gray-800">Crypto Subscription</h1>
                <h1 class="text-center mx-auto text-indigo-500 text-4xl font-bold mt-2">Payments Made Easily</h1>
                <h2 class="mx-auto text-gray-500 mt-3">Recurring payments without a hassle</h2>
                <div class="flex flex-row justify-center mt-2 gap-2">
                    <a href="/login" class="font-bold w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center ">Login</a>
                    <a class="font-bold w-42  bg-gray-300 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center " href="https://medium.com/@hopeter_20531">Blog</a>
                </div>
            </section>
            <section class="flex flex-col justify-center mt-10 ">
                <div class="flex flex-row justify-center">
                    <div class={"grow w-full flex flex-row justify-around flex-wrap gap-2 bg-gray-50 rounded m-8 shadow-lg max-w-7xl"}>
                        <img src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/API_V1/static/dancing-llama.gif" width="250" />
                        <div class={"flex flex-col justify-center mb-4 p-4"}>
                            <h2 class="text-4xl font-bold mt-2 text-gray-800 w-80">Map your EOA to a Password</h2>
                            <p class="text-gray-600 whitespace-break-spaces w-80">Externally owned accounts require you to send transactions manually. Using DebitLlama you can connect your EOA and initiate payments on secure checkout pages, just by entering a password!</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row justify-center">
                    <div class={"grow w-full flex flex-row justify-around flex-wrap gap-2 bg-gray-50 rounded m-8 shadow-lg max-w-7xl"}>
                        <img src="https://raw.githubusercontent.com/StrawberryChocolateFudge/debitLLama-server/API_V1/static/yeah-llama.gif" width="250px" />
                        <div class={"flex flex-col justify-center mb-4 p-4"}>
                            <h2 class="text-4xl font-bold mt-2 text-gray-800 w-80">Easy merchant integration</h2>
                            <p class="text-gray-600 whitespace-break-spaces w-80">Simply embedd our checkout button, it's compatible with every website! Receive recurring crypto payments from your customers automatically afterwards.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="flex flex-col justify-center mt-10">
                <div class="flex flex-row justify-center">
                    <div class={"grow w-full flex flex-row justify-around flex-wrap gap-2 bg-gray-50 rounded m-8 shadow-lg max-w-7xl p-10"}>
                        <h1 class="text-center mx-auto text-4xl font-bold mt-2 text-gray-800">See the docs to learn more</h1>
                        <div class="flex flex-row justify-center mt-2">
                            <a href="https://debitllama.gitbook.io/debitllama/" class="font-bold w-42 text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Read the Docs</a>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    </>
}