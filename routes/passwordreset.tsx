import { Handlers, PageProps } from "$fresh/server.ts";
import { rand } from "../lib/backend/auth.ts";
import QueryBuilder from "../lib/backend/queryBuilder.ts";
import { doSendPasswordResetEmailMessage } from "../lib/email/doSend.ts";
import { State } from "./_middleware.ts";

// I need a page also with args for the password reset link and then passwords that can be entered twice and such :) 

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        if (query.length !== 22) {
            return ctx.render({ ...ctx.state, pageState: PasswordResetPageState.initialPage, nonce: 0 })
        }

        const { data, error } = await select.PasswordResetUrls.byQ(query);

        if (data.length !== 0) {
            //I found the password reset url so enter password page is used

            return ctx.render({ ...ctx.state, pageState: PasswordResetPageState.enterpassword, nonce: data[0].nonce });

        } else {
            // Didn't find the password reset url so I return initial page
            return ctx.render({ ...ctx.state, pageState: PasswordResetPageState.initialPage, nonce: 0 });
        }
    },

    async POST(req, ctx) {
        const form = await req.formData();
        const posttype = form.get("posttype") as string;
        const queryBuilder = new QueryBuilder(ctx);

        if (posttype === "0") {

            const email = form.get("email") as string;
            // TODO: REFACTOR TO QUERY BUILDER!
            const { data, error } = await ctx.state.supabaseClient.rpc(
                "get_user_id_by_email",
                {
                    email,
                }
            );

            if (data.length !== 0) {
                // Should be 1
                const id = data[0].id
                // Now I generate a new query url 
                const q = rand() + rand();
                const nonce = rand() + rand();
                await queryBuilder.insert().PasswordResetUrls.createNew(q, id, nonce).then(async () => {
                    //Send email!
                    const res = await doSendPasswordResetEmailMessage(email, q);
                    console.log("email sent:", res);
                });
            }

            // I just show success page no matter what, so it can't be used to guess the registered email addresses!

            return ctx.render({ ...ctx.state, pageState: PasswordResetPageState.resetEmailSent });
        } else if (posttype === "1") {

            const password = form.get("password") as string;
            const passwordAgain = form.get("passwordAgain") as string;
            const nonce = form.get("nonce") as string;
            const { data, error } = await queryBuilder.select().PasswordResetUrls.byNonce(nonce);
            if (data.length !== 0) {
                const user_id = data[0].user_id;
                // /?TODO: I need to update the user password but for that I need to log him in, oh dear 
            }

            return ctx.render({ ...ctx.state });
        } else {
            return ctx.render({ ...ctx.state, nonce: 0 })
        }

    }
}

enum PasswordResetPageState {
    initialPage,
    resetEmailSent,
    enterpassword
}

export default function PasswordResetPage(props: PageProps) {
    return <div></div>

    const nonce = props.data.nonce;
    const pageState = props.data.pageState;

    if (pageState === PasswordResetPageState.initialPage) {

        return <section class="bg-gray-200 h-screen">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="mx-auto">
                    <h2 class="text-2xl font-bold mb-5 text-center">Welcome to <span>Debit</span><span class="text-gray-600">Llama</span></h2>
                </div>

                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                    <div class="mx-auto pt-1 pb-1">
                        <h2 class="text-2xl text-center text-gray-600">Forgot your password?</h2>
                    </div>
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form class="space-y-4 md:space-y-6" method="POST">
                            <input type="hidden" name="posttype" value="0" />
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium">Enter your email address</label>
                                <input type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
                            </div>
                            <div class={"flex flex-row justify-start"}>
                                <button type="submit" class="w-64 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Request Password Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    } else if (pageState === PasswordResetPageState.enterpassword) {
        return <section class="bg-gray-200 h-screen">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="mx-auto">
                    <h2 class="text-2xl font-bold mb-5 text-center">Welcome to <span>Debit</span><span class="text-gray-600">Llama</span></h2>
                </div>

                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                    <div class="mx-auto pt-1 pb-1">
                        <h2 class="text-2xl text-center text-gray-600">Forgot your password?</h2>
                    </div>
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form class="space-y-4 md:space-y-6" method="POST">
                            <input type="hidden" name="posttype" value="1" />

                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium">Enter your new password:</label>
                                <input type="password" name="password" id="password" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="***" />
                            </div>
                            <div>
                                <label for="passwordAgain" class="block mb-2 text-sm font-medium">Password again:</label>
                                <input type="password" name="passwordAgain" id="passwordAgain" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="***" />
                            </div>
                            <input name="nonce" type="hidden" value={nonce} />
                            <div class={"flex flex-row justify-start"}>
                                <button type="submit" class="w-64 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Request Password Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    } else if (pageState === PasswordResetPageState.resetEmailSent) {
        return <section class="bg-gray-200 h-screen">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="mx-auto">
                    <h2 class="text-2xl font-bold mb-5 text-center">Welcome to <span>Debit</span><span class="text-gray-600">Llama</span></h2>
                </div>

                <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gradient-gray-to-white-variant2">
                    <div class="mx-auto pt-1 pb-1">
                        <h2 class="text-2xl text-center text-gray-600">Password Reset email sent!</h2>
                    </div>
                </div>
            </div>
        </section>
    }
}