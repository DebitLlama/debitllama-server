// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { signUp } from "../lib/backend/auth.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {

    async POST(req, ctx) {
        const form = await req.formData();
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const { error } = await signUp(ctx.state.supabaseClient, email, password);

        const headers = new Headers();

        let redirect = "/"
        if (error) {
            redirect = `/signup?error=${error.message}`
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
        <section class="bg-gray-200 fixed w-full h-full overflow-auto">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">


                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0" >
                    <div class={"mx-auto"}>
                        <img src="/ridingALlama.png" />
                    </div>
                    <div class="mx-auto">
                        <h2 class="text-2xl font-bold mb-5 text-center">Sign Up</h2>
                    </div>
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {err && (
                            <div class="bg-red-400 border-l-4 p-4" role="alert">
                                <p class="font-bold">Error</p>
                                <p>{err}</p>
                            </div>
                        )}
                        <form class="space-y-4 md:space-y-6" method="POST">
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
                                <input type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
                            </div>

                            <button type="submit" class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign Up</button>
                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Login here</a>
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </section></>
    );
}