// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { State } from "../_middleware.ts";
import { updateUserPassword } from "../../lib/backend/db/auth.ts";

export const handler: Handlers<any, State> = {

    async POST(req, ctx) {
        const form = await req.formData();
        const password = form.get("password") as string;
        const passwordagain = form.get("passwordagain") as string;
        const headers = new Headers();
        let redirect = "/login";
        if (password !== passwordagain) {
            redirect = `/app/updatepassword?error=${"Passwords don't match"}`
            headers.set("location", redirect);
            return new Response(null, {
                status: 303,
                headers,
            });
        }

        const { error } = await updateUserPassword(ctx.state.supabaseClient, password);

        if (error) {
            redirect = `/login?error=${error.message}`
        }

        headers.set("location", redirect);


        return new Response(null, {
            status: 303,
            headers,
        });
    }
}

export default function Login(props: PageProps) {
    const err = props.url.searchParams.get("error");
    return (
        <>
            <html lang="en">
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
                            <h2 class="text-2xl font-bold mb-5 text-center"><span>Debit</span><span class="text-gray-600">Llama</span></h2>
                        </div>
                        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                            <div class="mx-auto pt-1 pb-1">
                                <h2 class="text-2xl text-center text-gray-600">Update Your Password</h2>
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
                                        <label for="password" class="block mb-2 text-sm font-medium">New Password</label>
                                        <input required type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label for="passwordagain" class="block mb-2 text-sm font-medium">Password Again</label>
                                        <input required type="password" name="passwordagain" id="passwordagain" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
                                    </div>
                                    <button type="submit" class="w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Reset password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </html>
        </>
    );
}