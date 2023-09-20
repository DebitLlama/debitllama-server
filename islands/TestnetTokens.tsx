import { getContract, handleNetworkSelect, mintToken, requestAccounts, watchAsset } from "../lib/frontend/web3.ts";
import { ChainIds, DonauTestnetTokens } from "../lib/shared/web3.ts";

export interface TestnetTokensProps {
    chainId: ChainIds
}

export default function TestnetTokens(props: TestnetTokensProps) {

    const handleError = (msg: string) => {
        alert(msg);
    }

    const mintTokensClicked = async () => {

        const provider = await handleNetworkSelect(props.chainId, handleError);

        if (!provider) {
            return;
        }

        const address = await requestAccounts();

        const USDTMAddress = DonauTestnetTokens.USDTM;

        const usdtmContract = await getContract(
            provider,
            USDTMAddress,
            "/MOCKERC20.json");

        const tx = await mintToken(usdtmContract, address);

        await tx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
                await watchAsset({
                    address: USDTMAddress,
                    symbol: "USDTM",
                    decimals: 18
                }, handleError);
            }
        })

    }

    return <div class="mb-4">
        <button onClick={mintTokensClicked} type="button" class="w-full bg-yellow-500 text-white text-sm font-bold py-2 px-4 rounded-md  hover:bg-yellow-600 disabled:bg-yellow-100 transition duration-300">
            Mint testnet tokens
        </button>
        <h4 class="text-sm text-gray-500">We are on testnet, connected wallets only work with ERC-20 tokens, so to try the app you need to mint some first! It's called USDT Mock. (USDTM)</h4>
    </div>
}