export interface LoggedOutUiProps {
    url: string,
    buttonid: string
}
export function LoggedOutUi(props: LoggedOutUiProps) {
    const err = new URL(props.url).searchParams.get("error");
    return <div class="pb-3 max-w-sm mx-auto">
        {err && (
            <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
            </div>
        )}
        <form class="space-y-4 md:space-y-6" method="POST">
            <input type="hidden" name="buttonId" value={props.buttonid} />
            <div class="">
                <h2 class="text-2xl font-bold mb-5 text-center select-none">Log In To Continue</h2>
            </div>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
                <input type="email" name="email" id="email" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="name@company.com" />
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" class="border border-gray-300 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500" />
            </div>

            <button type="submit" class="w-full text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Log In</button>
            <p class="text-sm" >By logging in you accept the <a href="/termsAndConditions" class="text-sm text-indigo-500">Terms and conditions</a></p>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet? <a target="_blank" href="/signup" class="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Sign up</a>
            </p>
        </form>
    </div>
}
