// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import WalletAddressSelector from "../../islands/WalletAddressSelector.tsx";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { validateAddress } from "../../lib/backend/web3.ts";
import { State } from "../_middleware.ts";
export const handler: Handlers<any, State> = {
    async POST(req, ctx) {
        const form = await req.formData();
        const walletAddress = form.get("walletaddress") as string;
        const code = form.get("code") as string;
        const queryBuilder = new QueryBuilder(ctx);

        const headers = new Headers();

        if (code.length < 5) {
            headers.set("location", `/app/affiliate?error=${"Invalid code. Too short. Must be at least 4 characters."}`);
            return new Response(null, { status: 303, headers })
        }

        const validAddress = validateAddress(walletAddress);

        if (!validAddress) {
            headers.set("location", `/app/affiliate?error=${"Invalid wallet address!"}`);
            return new Response(null, { status: 303, headers })
        }

        const { data: existingCode } = await queryBuilder.select().AffiliateCodes.byCreatorId();

        try {
            if (existingCode.length === 0) {
                await queryBuilder.insert().AffiliateCodes.forCreatorId(walletAddress, code);
            } else {
                await queryBuilder.update().AffiliateCodes.forCreatorId(walletAddress, code);
            }
        } catch (err) {
            headers.set("location", `/app/affiliate?error=${"Oops an error occured!"}`);
            return new Response(null, { status: 303, headers })
        }

        headers.set("location", `/app/affiliate?success=${"Data updated!"}`);
        return new Response(null, { status: 303, headers })


    },

    async GET(_req, ctx) {
        const queryBuilder = new QueryBuilder(ctx);
        const { data } = await queryBuilder.select().AffiliateCodes.byCreatorId();

        const exists = data.length > 0;

        const walletAddress = exists ? data[0].walletAddress : "";
        const code = exists ? data[0].code : "";


        return ctx.render({ ...ctx.state, walletAddress, code })
    }
}

export default function Feedback(props: PageProps) {
    const err = props.url.searchParams.get("error");
    const success = props.url.searchParams.get("success");

    return <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
        <div class="mt-10 px-5 mx-auto flex  flex-col justify-center">
            <div class="flex flex-row justify-center">
                <div class="border-2 max-w-screen-md mx-auto rounded shadow-lg p-5">
                    <div class="flex flex-row justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" height="60" viewBox="0 -960 960 960" width="60"><path d="M160-120q-50 0-85-35t-35-85q0-50 35-85t85-35q9 0 17.5 1.5T194-355l162-223q-17-21-26.5-47t-9.5-55q0-66 47-113t113-47q66 0 113 47t47 113q0 29-10 55t-27 47l163 223q8-2 16.5-3.5T800-360q50 0 85 35t35 85q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-19 5.5-36.5T701-308L539-531q-5 2-9.5 3t-9.5 3v172q35 12 57.5 43t22.5 70q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-39 22.5-69.5T440-353v-172q-5-2-9.5-3t-9.5-3L259-308q10 14 15.5 31.5T280-240q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T200-240q0-17-11.5-28.5T160-280q-17 0-28.5 11.5T120-240q0 17 11.5 28.5T160-200Zm320-480Zm0 480q17 0 28.5-11.5T520-240q0-17-11.5-28.5T480-280q-17 0-28.5 11.5T440-240q0 17 11.5 28.5T480-200Zm320 0q17 0 28.5-11.5T840-240q0-17-11.5-28.5T800-280q-17 0-28.5 11.5T760-240q0 17 11.5 28.5T800-200Zm-640-40Zm320 0Zm320 0ZM480-600q33 0 56.5-23.5T560-680q0-33-23.5-56.5T480-760q-33 0-56.5 23.5T400-680q0 33 23.5 56.5T480-600Z" /></svg>
                    </div>
                    <div class="flex flex-row justify-center">
                        <h1 class="text-2xl">Become an Affiliate</h1>
                    </div>
                    <div class="flex flex-row justify-center">
                        <p class="text-lg">You can create an affiliate code and share it with other users who can add it to their connected wallet or virtual account. You are eligible to receive a payout once a month, collected from each subscription payment the affiliated account makes.</p>
                    </div>
                    <form method={"POST"} class="flex flex-row justify-center flex-wrap gap-2">
                        <div class="relative mb-4 flex flex-wrap items-stretch">
                            <span
                                class="w-64 flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                                id="basic-addon1"
                            ><WalletAddressSelector /></span>
                            <input
                                type="text"
                                class="relative m-0 block min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                placeholder="Wallet Address"
                                aria-label="Wallet Address"
                                name="walletaddress"
                                required
                                id="walletAddressInput"
                                value={props.data.walletAddress}
                            />
                        </div>
                        <div class="relative mb-4 flex flex-wrap items-stretch">
                            <span
                                class="w-64 flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                                id="basic-addon1"
                            >
                                <button
                                    aria-label={"Save code button"}
                                    class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                                    Update code
                                </button></span>
                            <input
                                type="text"
                                class="relative m-0 block min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                placeholder="Create a code"
                                aria-label="Affiliate code"
                                name="code"
                                required
                                id="affiliatecode"
                                minLength={5}
                                value={props.data.code}
                            />
                        </div>
                    </form>
                    <div class="flex flex-row justify-center">
                        <p class="text-lg">Connect your wallet and enter any code.<strong> Click Update Code to save it.</strong> You can update your wallet again later by connecting a new one and clicking Update Code, but if you update your old code, all the accounts using it will stop paying rewards to your address!</p>
                    </div>
                    {err && (
                        <div class="bg-red-400 border-l-4 p-4" role="alert">
                            <p class="font-bold">Error</p>
                            <p>{err}</p>
                        </div>
                    )}
                    {success && (
                        <div class="bg-green-400 border-l-4 p-4" role="alert">
                            <p class="font-bold">Code Updated</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Layout >
}