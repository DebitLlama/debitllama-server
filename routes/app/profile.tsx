// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import QueryBuilder from "../../lib/backend/db/queryBuilder.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { CookieNames } from "../../lib/enums.ts";


export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    let redirect = "/app/profile";
    const headers = new Headers();


    const form = await req.formData();
    const id = form.get("id") as string;

    const firstname = form.get("firstname") as string;
    const lastname = form.get("lastname") as string;
    const addressline1 = form.get("addressline1") as string;
    const addressline2 = form.get("addressline2") as string;
    const city = form.get("city") as string;
    const postcode = form.get("postcode") as string;
    const country = form.get("country") as string;

    const queryBuilder = new QueryBuilder(ctx);
    const upsert = queryBuilder.upsert();
    const { error } = await upsert.Profiles.all(
      firstname,
      lastname,
      addressline1,
      addressline2,
      city,
      postcode,
      country,
    );


    if (error) {
      redirect = `/app/profile?error=${error.message}`
    } else {

      const profileRedirect = getCookies(req.headers)[CookieNames.profileRedirect];

      if (profileRedirect) {
        deleteCookie(headers, CookieNames.profileRedirect);
        //If I should redirect to another page, please do!
        redirect = profileRedirect;
      } else {
        redirect = `/app/profile?success=${true}`
      }
    }

    headers.set("location", redirect);


    return new Response(null, { status: 303, headers })
  },
  async GET(_req, ctx) {
    const queryBuilder = new QueryBuilder(ctx);
    const select = queryBuilder.select();
    // Get the data and use it to populate the fields!
    const { data: profileData } = await select.Profiles.byUserId();

    if (profileData === null || profileData.length === 0) {
      return ctx.render(
        {
          ...ctx.state,
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
  let success = props.url.searchParams.get("success");
  // In case both search params exist, success is set to false and I only show the error
  if (err) {
    success = null;
  }
  return (
    <Layout url={props.url.toString()} renderSidebarOpen={props.data.renderSidebarOpen} isLoggedIn={props.data.token}>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <div>
          <h1 class="text-2xl font-bold mb-5">Profile</h1>
          {err && (
            <div class="bg-red-400 border-l-4 p-4" role="alert">
              <p class="font-bold">Something went wrong!</p>
              <p>{err}</p>
            </div>
          )}
          {success && (
            <div class="bg-green-400 border-l-4 p-4" role="alert">
              <p class="font-bold">Profile updated!</p>
            </div>
          )}
          <form method="POST">
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="bg-gray-50 flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >First Name</span
              >
              <input
                type="text"
                aria-label="First name"
                placeholder={"First Name"}
                name="firstname"
                value={props.data.firstname}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" />

            </div>
            <hr
              class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <div class="relative flex flex-wrap items-stretch">
              <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              >Last Name</span>
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
            <div class="flex flex-row">
              <button
                aria-label={"Save your profile changes"}
                type="submit"
                class="w-64 mx-auto text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

    </Layout>
  );
}