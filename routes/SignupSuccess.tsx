export default function SignupSuccess() {
    return <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
        <div class="flex flex-row flex-wrap gap-2 justify-between p-2 ">
            <div class="flex flex-col justify-center">
                <div class="text-2xl  ml-1 font-bold flex flex-row">
                    <img alt="debitllama logo" src="/logo.svg" width="45" height="45" class={"mr-3"} />{" "}
                    <h1 class="text-2xl font-bold mt-1 text-center">Sign Up Successful</h1>
                </div>
            </div>
        </div>
        <h2 class="text-xl font-bold mb-6 text-center">Check your email to confirm your email address!</h2>
        <div class="flex flex-row justify-center">
            <a class="mx-auto text-xl text-indigo-800" href="/login">Go to Login</a>
        </div>
    </div>
}