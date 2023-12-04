import { Head } from "$fresh/runtime.ts";

export default function SignupSuccess() {
    return <><html lang="en">
        <Head>
            <title>DebitLlama</title>
            <link rel="stylesheet" href="/styles.css" />
        </Head>
        <section class="bg-gray-200 h-screen">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="mx-auto mb-5">
                    <img alt="debitllama logo" src="/logo.svg" width="100" height="100" />
                </div>
                <div class="mx-auto">
                    <h2 class="text-2xl font-bold mb-5 text-center">Signup successful</h2>
                </div>
                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                    <h2 class="text-xl font-bold mb-6 text-center">Check your email to confirm your email address!</h2>
                    <div class="flex flex-row justify-center">
                        <a class="mx-auto text-xl text-indigo-800" href="/login">Go to Login</a>
                    </div>
                </div>
            </div>
        </section>
    </html>
    </>
}

