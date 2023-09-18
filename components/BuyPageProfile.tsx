export interface ProfileProps {
    firstname: string,
    lastname: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    postcode: string,
    country: string

    setFirstName: (to: string) => void;
    setLastName: (to: string) => void;
    setAddressLine1: (to: string) => void;
    setAddressLine2: (to: string) => void;
    setCity: (to: string) => void;
    setPostcode: (to: string) => void;
    setCountry: (to: string) => void;
}

export interface BuyPageProfileProps {
    profileExists: boolean
    profile: ProfileProps
}

export default function BuyPageProfile(props: BuyPageProfileProps) {
    if (props.profileExists) {
        return <div></div>
    }

    return <div class="p-2">
        <h4 class="text-2xl text-center mb-4 text-gray-500">You need to set up your profile!</h4>
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >First Name</span>
            <input
                type="text"
                aria-label="First name"
                placeholder={"..."}
                name="firstname"
                value={props.profile.firstname}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />

        </div>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >Last Name</span>
            <input
                type="text"
                aria-label="Last name"
                placeholder={"..."}
                name="lastname"
                value={props.profile.lastname}
                required
                class="relative m-0 -ml-px block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />
        </div>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >Address Line 1</span>
            <input
                type="text"
                aria-label="Address Line 1"
                placeholder={"..."}
                name="addressline1"
                value={props.profile.addressLine1}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />
        </div>

        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >Address Line 2</span>
            <input
                type="text"
                aria-label="Address Line 2"
                placeholder={"..."}
                name="addressline2"
                value={props.profile.addressLine2}
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />
        </div>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >City</span>
            <input
                type="text"
                aria-label="City"
                placeholder={"..."}
                name="city"
                value={props.profile.city}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />
        </div>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >Postcode</span>
            <input
                type="text"
                aria-label="Postcode"
                placeholder={"..."}
                name="postcode"
                value={props.profile.postcode}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />
        </div>

        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <div class="relative flex flex-wrap items-stretch bg-gray-50">
            <span
                class="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-bold leading-[1.6] text-gray-700 dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200"
            >Country</span>
            <input
                type="text"
                aria-label="Country"
                placeholder={"..."}
                name="country"
                value={props.profile.country}
                required
                class="rounded-0 relative m-0 block w-[1px] min-w-0 flex-auto border border-solid border-neutral-300  bg-clip-padding px-3 py-[0.25rem] text-base font-bold leading-[1.6] text-gray-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-gray-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-gray-200 dark:placeholder:text-gray-200 dark:focus:border-primary" />

        </div>
        <hr
            class="my-1 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
    </div>
}

