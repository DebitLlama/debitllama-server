// On an Off Ramping for USDC and EURC on Avax

import { Head } from "$fresh/runtime.ts";

export default function Ramp() {
    return <>
        <html lang="en">
            <Head>
                <title>DebitLlama</title>
                <link rel="stylesheet" href="/styles.css" />
            </Head>
            <section class="bg-gray-200 h-screen">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                        <div class="mx-auto pt-1 pb-1">
                            <h2 class="text-2xl text-center text-gray-600">On and Off Ramp</h2>
                            <h6 class="text-center" >KYC-less cash out is available!</h6>
                        </div>
                        <div class="h-fit">
                            <iframe
                                style="height: 600px;"
                                class="w-full"
                                allow="usb; ethereum; clipboard-write"
                                loading="lazy"
                                src="https://widget.mtpelerin.com/?lang=en"
                                title="Mt Pelerin exchange widget"></iframe>
                        </div>
                    </div>
                </div>
            </section>

        </html>
    </>
}