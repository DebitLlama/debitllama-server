import { AccountTypes } from "../enums.ts";

export const FeeDividerPerNetwork = {
  BTT_TESTNET: [20, "5%"], //value and the percentage
  BTT_MAINNET: [20, "5%"],
};

export function getAverageGasLimit() {
  return 400000n;
}

export enum NetworkNames {
  BTT_TESTNET = "BTT Donau Testnet",
  BTT_MAINNET = "BitTorrent Chain",
}
export const availableNetworks = [
  NetworkNames.BTT_MAINNET.toString(),
  NetworkNames.BTT_TESTNET.toString(),
];

export enum NetworkTickers {
  BTT_TESTNET = "BTT",
  BTT_MAINNET = "BTT",
}

export enum ChainIds {
  BTT_TESTNET_ID = "0x405",
  BTT_MAINNET_ID = "0xc7",
}

export const availableChainIds = [
  ChainIds.BTT_TESTNET_ID.toString(),
  ChainIds.BTT_MAINNET_ID.toString(),
];

export enum VirtualAccountsContractAddress {
  BTT_TESTNET = "0xF75515Df5AC843a8B261E232bB890dc2F75A4066",
  BTT_MAINNET = "0xc4Cf42D5a6F4F061cf5F98d0338FC5913b6fF581",
}

export enum ConnectedWalletsContractAddress {
  BTT_TESTNET = "0x9c85da9E45126Fd45BC62656026A2E7226bba239",
  BTT_MAINNET = "0xF9962f3C23De4e864E56ef29125D460c785905c6",
}

export enum RPCURLS {
  BTT_TESTNET = "https://pre-rpc.bt.io/",
  BTT_MAINNET = "https://rpc.bittorrentchain.io",
}

export enum EXPORERURLS {
  BTT_TESTNET = "https://testscan.bt.io",
  BTT_MAINNET = "https://bttcscan.com",
}

export enum DonauTestnetTokens {
  USDTM = "0x4420a4415033bd22393d3A918EF8d2c9c62efD99",
}

export enum BTTMAinnetTokens {
  USDD_t = "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1",
  USDT_e = "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B",
}

export enum RelayerGasTrackerContractAddress {
  BTT_TESTNET = "0x3e4E07926c1c4AC9f29539E385fBbF700b49F221",
  BTT_MAINNET = "0x8c142b126fad0E0553aA1d4c84Ae33eA5FcBF0C5",
}

export const rpcUrl: { [key in ChainIds]: RPCURLS } = {
  [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: RPCURLS.BTT_MAINNET,
};

export const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
  [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: EXPORERURLS.BTT_MAINNET,
};

export const explorerUrlAddressPath: { [key in ChainIds]: string } = {
  [ChainIds.BTT_TESTNET_ID]: "/#/address/",
  [ChainIds.BTT_MAINNET_ID]: "/address/",
};

export const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: NetworkTickers.BTT_MAINNET,
};

export const mapNetworkNameToFeeDivider: { [key in NetworkNames]: string } = {
  [NetworkNames.BTT_MAINNET]: FeeDividerPerNetwork.BTT_MAINNET[1] as string,
  [NetworkNames.BTT_TESTNET]: FeeDividerPerNetwork.BTT_TESTNET[1] as string,
};

export const mapChainIdToFeePercentage: { [key in ChainIds]: string } = {
  [ChainIds.BTT_MAINNET_ID]: FeeDividerPerNetwork.BTT_MAINNET[1] as string,
  [ChainIds.BTT_TESTNET_ID]: FeeDividerPerNetwork.BTT_TESTNET[1] as string,
};
export const mapChainIdToFeeDivider: { [key in ChainIds]: number } = {
  [ChainIds.BTT_MAINNET_ID]: FeeDividerPerNetwork.BTT_MAINNET[0] as number,
  [ChainIds.BTT_TESTNET_ID]: FeeDividerPerNetwork.BTT_TESTNET[0] as number,
};

export const getVirtualAccountsContractAddress: {
  [keys in ChainIds]: VirtualAccountsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: VirtualAccountsContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: VirtualAccountsContractAddress.BTT_MAINNET,
};

export const getConnectedWalletsContractAddress: {
  [keys in ChainIds]: ConnectedWalletsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: ConnectedWalletsContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: ConnectedWalletsContractAddress.BTT_MAINNET,
};

export const getAbiJsonByAccountType: {
  [keys in AccountTypes]: string;
} = {
  [AccountTypes.VIRTUALACCOUNT]: "/VirtualAccounts.json",
  [AccountTypes.CONNECTEDWALLET]: "/ConnectedWallets.json",
};

export const getRelayerGasTrackerContractAddress: {
  [keys in ChainIds]: RelayerGasTrackerContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: RelayerGasTrackerContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: RelayerGasTrackerContractAddress.BTT_MAINNET,
};

export const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: NetworkNames.BTT_MAINNET,
};

export const chainIdFromNetworkName: { [key in NetworkNames]: ChainIds } = {
  [NetworkNames.BTT_TESTNET]: ChainIds.BTT_TESTNET_ID,
  [NetworkNames.BTT_MAINNET]: ChainIds.BTT_MAINNET_ID,
};

export function getChainExplorerForChainId(chainId: ChainIds, tx: string) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return `https://testnet.bttcscan.com/tx/${tx}`;
    case ChainIds.BTT_MAINNET_ID:
      return `https://bttcscan.com/tx/${tx}`;
    default:
      return ``;
  }
}

export type SelectableCurrency = {
  name: string;
  native: boolean;
  contractAddress: string;
  minimumAmount: string;
};

export const ethereumCurrencies: SelectableCurrency[] = [
  { name: "ETH", native: true, contractAddress: "", minimumAmount: "0.01" },
  { name: "USDC", native: false, contractAddress: "", minimumAmount: "1" },
];

export const bittorrentCurrencies: SelectableCurrency[] = [{
  name: "BTT",
  native: true,
  contractAddress: "",
  minimumAmount: "5000",
}, {
  name: "USDTM",
  native: false,
  contractAddress: DonauTestnetTokens.USDTM,
  minimumAmount: "1",
}];

export const bttMainnetCurrencies: SelectableCurrency[] = [{
  name: "BTT",
  native: true,
  contractAddress: "",
  minimumAmount: "5000",
}, {
  name: "USDD_t",
  native: false,
  contractAddress: "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1",
  minimumAmount: "0.1",
}, {
  name: "USDT_e",
  native: false,
  contractAddress: "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B",
  minimumAmount: "0.1",
}];

export const getCurrenciesForNetworkName: {
  [key in NetworkNames]: SelectableCurrency[];
} = {
  [NetworkNames.BTT_TESTNET]: bittorrentCurrencies,
  [NetworkNames.BTT_MAINNET]: bttMainnetCurrencies,
};

//TODO: Add more currency tickers here
export const mapCurrencyNameToRedstoneSymbol = (ticker: string) => {
  switch (ticker) {
    case "BTT":
      return "BTT";
    case "USDTM":
      return "USDT";
    case "USDD_t":
      return "USDD";
    case "USDT_e":
      return "USDT";
    default:
      return "";
  }
};