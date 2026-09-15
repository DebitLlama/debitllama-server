import { getContract, handleNetworkSelect, mintToken, requestAccounts, watchAsset } from "../../lib/frontend/web3.ts";
import { ChainIds, DonauTestnetTokens } from "../../lib/shared/web3.ts";

export interface TestnetTokensProps {
    chainId: ChainIds,
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


    return <div></div>

}