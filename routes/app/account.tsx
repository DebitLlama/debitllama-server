import Layout from "../../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

import { State } from "../_middleware.ts";
import { ChainIds, rpcUrl } from "../../lib/shared/web3.ts";
import { getAccount } from "../../lib/backend/web3.ts";

//TODO: Move save account data here and save it through a URL not a request! Yeah!

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        try {
            const { networkId, commitment, name } = JSON.parse(query);

            const networkExists = rpcUrl[networkId as ChainIds]
            if (!networkExists) {
                //   render a not found page
                return ctx.render({ ...ctx.state, notfound: true })
            }
            const accountData = await getAccount(commitment, networkId);
            if (accountData.exists) {
                // write a stored function for this select also!
                const { data, error } = await ctx.state.supabaseClient.from("Accounts").select().eq("commitment", commitment);
                if (data.length === 0) {

                    //TODO: need to check if the creator of the account is the same as the profile address saved

                    const { data: accountData, error: accountError } = await ctx.state.supabaseClient.from("Accounts").insert({
                        created_at: new Date().toISOString(),
                        user_id: ctx.state.userid,
                        network_id: networkId,
                        commitment: commitment,
                        name: name,
                        closed: false
                    })
                }

                //Then I return accepted
                // render the account data

            } else {
                // render a context not found page
                return ctx.render({ ...ctx.state, notfound: true })
            }

            return ctx.render(ctx.state);
        } catch (err) {
            //TODO: Show error page
            return new Response(null, { status: 500 })
        }
    }
}

//TODO: Render the account page!

export default function Account(props: PageProps) {
    return <Layout isLoggedIn={props.data.token}>

        {props.data.notfound ?
        // /?TODO: USE THIS AS BASE FOR THE ACCOUNT PAGE
        // <div class="flex justify-center h-screen items-center bg-gray-200 antialiased">
        //     <div class="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
        //         <div
        //             class="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg"
        //         >
        //             <p class="font-semibold text-gray-800">Add a step</p>
        //             <svg
        //                 class="w-6 h-6"
        //                 fill="none"
        //                 stroke="currentColor"
        //                 viewBox="0 0 24 24"
        //                 xmlns="http://www.w3.org/2000/svg"
        //             >
        //                 <path
        //                     stroke-linecap="round"
        //                     stroke-linejoin="round"
        //                     stroke-width="2"
        //                     d="M6 18L18 6M6 6l12 12"
        //                 ></path>
        //             </svg>
        //         </div>
        //         <div class="flex flex-col px-6 py-5 bg-gray-50">
        //             <p class="mb-2 font-semibold text-gray-700">Bots Message</p>
        //             <textarea
        //                 type="text"
        //                 name=""
        //                 placeholder="Type message..."
        //                 class="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-36"
        //                 id=""
        //             ></textarea>
        //             <div class="flex flex-col sm:flex-row items-center mb-5 sm:space-x-5">
        //                 <div class="w-full sm:w-1/2">
        //                     <p class="mb-2 font-semibold text-gray-700">Customer Response</p>
        //                     <select
        //                         type="text"
        //                         name=""
        //                         class="w-full p-5 bg-white border border-gray-200 rounded shadow-sm appearance-none"
        //                         id=""
        //                     >
        //                         <option value="0">Add service</option>
        //                     </select>
        //                 </div>
        //                 <div class="w-full sm:w-1/2 mt-2 sm:mt-0">
        //                     <p class="mb-2 font-semibold text-gray-700">Next step</p>
        //                     <select
        //                         type="text"
        //                         name=""
        //                         class="w-full p-5 bg-white border border-gray-200 rounded shadow-sm appearance-none"
        //                         id=""
        //                     >
        //                         <option value="0">Book Appointment</option>
        //                     </select>
        //                 </div>
        //             </div>
        //             <hr />

        //             <div class="flex items-center mt-5 mb-3 space-x-4">
        //                 <input
        //                     class="inline-flex rounded-full"
        //                     type="checkbox"
        //                     id="check1"
        //                     name="check1"
        //                 />
        //                 <label class="inline-flex font-semibold text-gray-400" for="check1">
        //                     Add a crew</label
        //                 ><br />
        //                 <input
        //                     class="inline-flex"
        //                     type="checkbox"
        //                     id="check2"
        //                     name="check2"
        //                     checked
        //                 />
        //                 <label class="inline-flex font-semibold text-blue-500" for="check2">
        //                     Add a specific agent</label
        //                 ><br />
        //             </div>
        //             <div
        //                 class="flex flex-row items-center justify-between p-5 bg-white border border-gray-200 rounded shadow-sm"
        //             >
        //                 <div class="flex flex-row items-center">
        //                     <img
        //                         class="w-10 h-10 mr-3 rounded-full"
        //                         src="https://randomuser.me/api/portraits/lego/7.jpg"
        //                         alt=""
        //                     />
        //                     <div class="flex flex-col">
        //                         <p class="font-semibold text-gray-800">Xu Lin Bashir</p>
        //                         <p class="text-gray-400">table.co</p>
        //                     </div>
        //                 </div>
        //                 <h1 class="font-semibold text-red-400">Remove</h1>
        //             </div>
        //         </div>
        //         <div
        //             class="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg"
        //         >
        //             <p class="font-semibold text-gray-600">Cancel</p>
        //             <button class="px-4 py-2 text-white font-semibold bg-blue-500 rounded">
        //                 Save
        //             </button>
        //         </div>
        //     </div>
        // </div> 
        
        : <p>found</p>}

    </Layout>
}