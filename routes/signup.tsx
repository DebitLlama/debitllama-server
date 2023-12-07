// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { signUp } from "../lib/backend/db/auth.ts";
import { State } from "./_middleware.ts";
import { enqueueSlackNotification } from "../lib/backend/queue/kv.ts";

export const handler: Handlers<any, State> = {

    async POST(req, ctx) {
        const form = await req.formData();
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const { error } = await signUp(ctx.state.supabaseClient, email, password);

        const headers = new Headers();

        let redirect = "/SignupSuccess"
        if (error) {
            redirect = `/signup?error=${error.message}`
        }

        if (!error) {
            enqueueSlackNotification({
                isSlackWebhook: true,
                subject: "New Signup",
                message: "Hello world. I signed up.",
                email,
                slackWebhookUrl: "SLACKUSERSIGNUPS"
            })
        }

        headers.set("location", redirect);
        return new Response(null, {
            status: 303,
            headers,
        });
    }
}

export default function SignUp(props: PageProps) {
    const err = props.url.searchParams.get("error");

    return (<> <Head>
        <title>DebitLlama</title>
        <link rel="stylesheet" href="/styles.css" />
    </Head>
        <section class="bg-gray-200 h-screen">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 " >
                    <div class={"mx-auto"}>
                        <div class="mx-auto bg-gray-100">
                            <h2 class="text-2xl font-bold mb-5 text-center">Welcome to <span>Debit</span><span class="text-gray-600">Llama</span></h2>
                        </div>
                    </div>
                    <div class="mx-auto">
                        <h2 class="text-2xl text-gray-500 mb-5 text-center">Sign up for a Free Account!</h2>
                    </div>
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8 bg-gradient-white-to-gray">
                        {err && (
                            <div class="bg-red-400 border-l-4 p-4" role="alert">
                                <p class="font-bold">Error</p>
                                <p>{err}</p>
                            </div>
                        )}
                        <form class="space-y-4 md:space-y-6" method="POST">
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
                                <input required type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                                <input required type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
                            </div>

                            <button aria-label="Sign up button" type="submit" class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign Up</button>
                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/login" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Login here</a>
                            </p>
                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                Couldn't confirm your email address? <a href="/resendConfirmation" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Resend email</a>
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </section></>
    );
}