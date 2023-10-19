// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { Head } from "$fresh/runtime.ts";
import { signInWithPassword } from "../lib/backend/auth.ts";
import { State } from "./_middleware.ts";
import { CookieNames } from "../lib/enums.ts";
import { setRenderSidebarOpen, setSupaloginCookie } from "../lib/backend/cookies.ts";
import CookieBanner from "../islands/CookieBanner.tsx";

export const handler: Handlers<any, State> = {

    async POST(req, ctx) {
        const form = await req.formData();
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const { data, error } = await signInWithPassword(ctx.state.supabaseClient, email, password);
        const headers = new Headers();

        if (data.session) {
            setSupaloginCookie(headers, data.session?.access_token, data.session.expires_in)
            setRenderSidebarOpen(headers, "true", data.session.expires_in);
        }
        const redirectTo = getCookies(req.headers)[CookieNames.loginRedirect];

        let redirect = redirectTo === undefined || redirectTo === "" ? "/app/accounts" : redirectTo;

        deleteCookie(headers, CookieNames.loginRedirect);

        if (error) {
            redirect = `/login?error=${`Unable to Log in!`}`
        }
        // else {
        // EMAIL VERIFICATION IS DISABLED AND WILL BE DONE BY SUPABASE INSTEAD
        //     const select = new QueryBuilder(ctx).select();

        //     const { data: verifiedEmail, error: verifiedEmailErr } = await select.VerifiedEmails.byUserId(data.user.id);

        //     if (verifiedEmail.length === 0 || verifiedEmailErr !== null || !verifiedEmail[0].verified) {
        //         redirect = `/login?error=You need to verify your email address! Check your emails for the verification link!`
        //     }
        // }


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
        <> <Head>
            <title>DebitLlama</title>
            <link rel="stylesheet" href="/styles.css" />
        </Head>
            <section class="bg-gray-200 h-screen">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div class="mx-auto mb-5">
                        <img src="/logo.svg" width="100" />
                    </div>
                    <div class="mx-auto">
                        <h2 class="text-2xl font-bold mb-5 text-center">Welcome to <span>Debit</span><span class="text-gray-600">Llama</span></h2>
                    </div>
                    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                        <div class="mx-auto pt-1 pb-1">
                            <h2 class="text-2xl text-center text-gray-600">User Login</h2>
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

                                <button type="submit" class="w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Log in</button>
                                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don't have an account yet? <a href="/signup" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Sign up</a>
                                </p>
                                <hr />
                                {/* <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Forgot your password?  <a href="/passwordreset" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Password Reset</a>
                                </p> */}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <CookieBanner></CookieBanner>
        </>
    );
}