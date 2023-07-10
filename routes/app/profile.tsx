// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import WalletAddressSelector from "../../islands/WalletAddressSelector.tsx"
import { validateAddress } from "../../lib/web3backend.ts";


export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    let redirect = "/app/profile";
    const headers = new Headers();


    const form = await req.formData();
    const id = form.get("id") as string;
    const walletaddress = form.get("walletaddress") as string;

    const validAddress = validateAddress(walletaddress);

    if (!validAddress) {
      redirect = `/app/profile?error=${"Invalid Wallet Address"}`
      headers.set("location", redirect);
      return new Response(null, { status: 303, headers })
    }

    const firstname = form.get("firstname") as string;
    const lastname = form.get("lastname") as string;
    const addressline1 = form.get("addressline1") as string;
    const addressline2 = form.get("addressline2") as string;
    const city = form.get("city") as string;
    const postcode = form.get("postcode") as string;
    const country = form.get("country") as string;
    const userid = ctx.state.userid;

    const { error } = await ctx.state.supabaseClient
      .from("Profiles").upsert(
        {
          id,
          walletaddress,
          firstname,
          lastname,
          addressline1,
          addressline2,
          city,
          postcode,
          country,
          userid
        },
        { ignoreDuplicates: false }).select();


    if (error) {
      redirect = `/app/profile?error=${error.message}`
    }

    headers.set("location", redirect);


    return new Response(null, { status: 303, headers })
  },
  async GET(_req, ctx) {
    const userid = ctx.state.userid;

    // Get the data and use it to populate the fields!
    const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", userid);

    if (profileData[0] === undefined) {
      return ctx.render(
        {
          ...ctx.state,
          id: "",
          walletaddress: "",
          firstname: "",
          lastname: "",
          addressline1: "",
          addressline2: "",
          city: "",
          postcode: "",
          country: ""
        });

    } else {
      return ctx.render({ ...ctx.state, ...profileData[0] });
    }


  }
}
// ethAddress, companyName, fullName, addressLine1,addressLine2, city,country,nationality,postcode,state,phoneNumber
export default function Profile(props: PageProps) {

  const err = props.url.searchParams.get("error");

  return (
    <Layout isLoggedIn={props.data.token}>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <div class="mx-auto text-center">
          <h1 class="text-2xl font-bold mb-5">Profile</h1>
          {err && (
            <div class="bg-red-400 border-l-4 p-4" role="alert">
              <p class="font-bold">Something went wrong!</p>
              <p>{err}</p>
            </div>
          )}
          <form method="POST">
            <input type={"hidden"} name="id" value={props.data.id} />
            <div class="relative mb-4 flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                id="basic-addon1"
              ><WalletAddressSelector /></span>
              <input
                type="text"
                class="relative m-0 block min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                placeholder="Wallet Address"
                aria-label="Wallet Address"
                aria-describedby="basic-addon1"
                name="walletaddress"
                required
                id="walletAddressInput"
                value={props.data.walletaddress}
              />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >First and last name</span
              >
              <input
                type="text"
                aria-label="First name"
                placeholder={"First Name"}
                name="firstname"
                value={props.data.firstname}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
              <input
                type="text"
                aria-label="Last name"
                placeholder={"Last Name"}
                name="lastname"
                value={props.data.lastname}
                required
                class="relative m-0 -ml-px block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >Address Line 1</span
              >
              <input
                type="text"
                aria-label="Address Line 1"
                placeholder={"..."}
                name="addressline1"
                value={props.data.addressline1}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >Address Line 2</span
              >
              <input
                type="text"
                aria-label="Address Line 2"
                placeholder={"..."}
                name="addressline2"
                value={props.data.addressline2}
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >City</span
              >
              <input
                type="text"
                aria-label="City"
                placeholder={"..."}
                name="city"
                value={props.data.city}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >Postcode</span
              >
              <input
                type="text"
                aria-label="Postcode"
                placeholder={"..."}
                name="postcode"
                value={props.data.postcode}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >Country</span
              >
              <input
                type="text"
                aria-label="Country"
                placeholder={"..."}
                name="country"
                value={props.data.country}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />
            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <button
              type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Save
            </button>
          </form>
        </div>
      </div>

    </Layout>
  );
}