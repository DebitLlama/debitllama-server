// deno-lint-ignore-file no-explicit-any


export interface AccountPasswordInputProps {
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
        <input
            value={props.password}
            onKeyUp={(event: any) => props.setPassword(event.target.value)}
            onChange={(event: any) => props.setPassword(event.target.value)}
            required
            data-lpignore="true"
            autocomplete={"off"}
            class="w-full px-3 py-2 border-x border-t border-gray-300 rounded-t-md focus:outline-none focus:border-indigo-500"
            type="password" id="encryptionpass" name="encryptionpass" placeholder="********" />
        <PasswordStrengthDisplay passwordStrengthNotification={props.passwordStrengthNotification}></PasswordStrengthDisplay>
        <p class="text-sm text-gray-500 py-4 px-2">You need to use a good or strong password!</p>
    </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">Confirm Password</label>
            <input value={props.passwordAgain} onKeyUp={(event: any) => props.setPasswordAgain(event.target.value)} onChange={(event: any) => props.setPasswordAgain(event.target.value)} required data-lpignore="true" autocomplete={"off"} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="password" id="confirm-password" name="confirmpassword" placeholder="********" />
            <p class="text-red-800">{props.passwordMatchError}</p>
        </div>

    </>
}

interface PasswordStrengthDisplayProps {
    passwordStrengthNotification: string
}

function PasswordStrengthDisplay(props: PasswordStrengthDisplayProps) {
    return <div class="bg-white w-full border-gray-300  border-dotted border-2 rounded-b-lg flex flex-col text-md py-4 px-2 text-gray-800 ">
        <div>{props.passwordStrengthNotification === "" ? "Password Strength: None" : props.passwordStrengthNotification}</div>

    </div>
}