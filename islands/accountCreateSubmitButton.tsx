
//TODO: NEEDS TO CONNECT TO THE NETWORK AND SUBMIT A TRANSACTION TO THE BLOCKCHAIN!

interface AccountCreateSubmitButtonDisabled {
    buttonDisabled: boolean
}

export default function AccountCreateSubmitButton(props: AccountCreateSubmitButtonDisabled) {
    return <>
        <button
            disabled={props.buttonDisabled}
            class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-indigo-600 transition duration-300"
            type="submit">Create Account</button>
    </>
}