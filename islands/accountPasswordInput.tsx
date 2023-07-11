// deno-lint-ignore-file no-explicit-any

// NEEDS TO DISPLAY MESSAGE TO SHOW IF PASSWORD IS STRONG OR WEAK OR IF THEY MATCH

interface AccountPasswordInputProps {
    password: string,
    setPassword: (to: string) => void;
    passwordAgain: string;
    setPasswordAgain: (to: string) => void;
    passwordStrengthNotification: string;
    passwordMatchError: string;
}

export default function AccountPasswordInput(props: AccountPasswordInputProps) {
    return <> <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="encryptionpass">Virtual Account Password</label>
        <input value={props.password} onKeyUp={(event: any) => props.setPassword(event.target.value)} onChange={(event: any) => props.setPassword(event.target.value)} required data-lpignore="true" autocomplete={"off"} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type="password" id="encryptionpass" name="encryptionpass" placeholder="********" />


        <PasswordStrengthDisplay passwordStrengthNotification={props.passwordStrengthNotification}></PasswordStrengthDisplay>


    </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">Confirm Password</label>
            <input value={props.passwordAgain} onKeyUp={(event: any) => props.setPasswordAgain(event.target.value)} onChange={(event: any) => props.setPasswordAgain(event.target.value)} required data-lpignore="true" autocomplete={"off"} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="password" id="confirm-password" name="confirm-password" placeholder="********" />
            <p class="text-red-800">{props.passwordMatchError}</p>
        </div>
        <div class="mb-4">
            <p class="text-sm ...">The password is used for encrypting your account and it's needed for spending. Do not reuse your login password. The accounts are non-custodial and if you loose your password we can't recover it for you. You can always close the account and withdraw the deposit with the wallet you created it with.</p>

        </div>
    </>
}

interface PasswordStrengthDisplayProps {
    passwordStrengthNotification: string
}

function PasswordStrengthDisplay(props: PasswordStrengthDisplayProps) {
    return <div class="bg-white w-full rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500 ">
        {/* <div class="w-8 text-gray-900">H<span class="text-xs">1</span></div> */}
        <div>{props.passwordStrengthNotification === "" ? "Password Strength: None" : props.passwordStrengthNotification}</div>

    </div>
}