// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { signInWithPassword } from "../lib/backend/supabaseQueries.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {

    async POST(req, ctx) {
        const form = await req.formData();
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const { data, error } = await signInWithPassword(ctx.state.supabaseClient, email, password);

        const headers = new Headers();

        if (data.session) {
            setCookie(headers, {
                name: 'supaLogin',
                value: data.session?.access_token,
                maxAge: data.session.expires_in
            })
        }

        let redirect = "/app/accounts"


        if (error) {
            console.log(error);
            redirect = `/?error=${`Unable to Log in!`}`
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
            <section class="bg-gray-200">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div class="mx-auto mb-5">
                        <img src="/logo.svg" width="100" />
                    </div>
                    <div class="mx-auto">
                        <h2 class="text-2xl font-bold mb-5 text-center">Welcome to <span>Debit</span><span class="text-gray-600">Llama</span></h2>
                    </div>

                    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            {err && (
                                <div class="bg-red-400 border-l-4 p-4" role="alert">
                                    <p class="font-bold">Error</p>
                                    <p>{err}</p>
                                </div>
                            )}
                            <form class="space-y-4 md:space-y-6" method="POST">
                                <div class="mx-auto">
                                    <h2 class="text-2xl font-bold mb-5 text-center">Login</h2>
                                </div>
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
                                    <input type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
                                </div>
                                <div>
                                    <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
                                </div>

                                <button type="submit" class="w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Login In</button>
                                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don't have an account yet? <a href="/signup" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Sign up</a>
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
            <section class="fixed max-w-2xl p-4 mx-auto bg-white border border-gray-200 md:gap-x-4 left-12 bottom-16 dark:bg-gray-900 md:flex md:items-center dark:border-gray-700 rounded-2xl">
                <div class="flex items-center gap-x-4">
                    <span class="inline-flex p-2 text-indigo-500 rounded-lg shrink-0 dark:bg-gray-800 bg-indigo-100/80">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.9803 8.5468C17.5123 8.69458 17.0197 8.7931 16.5271 8.7931C14.2118 8.76847 12.3399 6.89655 12.3153 4.58128C12.3153 4.13793 12.3892 3.69458 12.537 3.27586C11.9951 2.68473 11.6995 1.92118 11.6995 1.13301C11.6995 0.812808 11.7488 0.492611 11.8473 0.172414C11.2315 0.0738918 10.6158 0 10 0C4.48276 0 0 4.48276 0 10C0 15.5172 4.48276 20 10 20C15.5172 20 20 15.5172 20 10C20 9.77833 20 9.55665 19.9754 9.33498C19.2611 9.26108 18.5468 8.99015 17.9803 8.5468ZM4.58128 7.31527C6.30542 7.31527 6.30542 10.0246 4.58128 10.0246C2.85714 10.0246 2.61084 7.31527 4.58128 7.31527ZM6.05912 15.7635C4.08867 15.7635 4.08867 12.8079 6.05912 12.8079C8.02956 12.8079 8.02956 15.7635 6.05912 15.7635ZM9.01478 1.33005C10.7389 1.33005 10.7389 4.28571 9.01478 4.28571C7.29064 4.28571 7.04434 1.33005 9.01478 1.33005ZM10.2463 8.84237C11.7241 8.84237 11.7241 10.8128 10.2463 10.8128C8.76848 10.8128 9.01478 8.84237 10.2463 8.84237ZM11.9704 16.9458C10.4926 16.9458 10.4926 14.9754 11.9704 14.9754C13.4483 14.9754 13.202 16.9458 11.9704 16.9458ZM16.6503 13.1034C15.4187 13.1034 15.4187 11.133 16.6503 11.133C17.8818 11.133 17.8818 13.1034 16.6503 13.1034Z" fill="currentColor" />
                        </svg>
                    </span>

                    <p class="text-sm text-gray-600 dark:text-gray-300">We use cookies to ensure you stay logged in. <a href="#" class="text-indigo-500 hover:underline">Read cookies policies</a>. </p>
                </div>

                <div class="flex items-center mt-6 gap-x-4 shrink-0 lg:mt-0">

                    <button class=" text-xs w-1/2 md:w-auto font-medium bg-gray-800 rounded-lg hover:bg-gray-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none">
                        Accept All Cookies
                    </button>
                </div>
            </section>
        </>
    );
}