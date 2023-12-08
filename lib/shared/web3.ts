import { AccountTypes, RelayerBalance } from "../enums.ts";

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

//This is used with the RelayerBalance DB Table!
export function mapNetworkNameToDBColumn(
  selectedNetwork: NetworkNames,
  relayerData: RelayerBalance,
) {
  switch (selectedNetwork) {
    case NetworkNames.BTT_TESTNET:
      return relayerData.BTT_Donau_Testnet_Balance;
    case NetworkNames.BTT_MAINNET:
      return relayerData.BTT_Mainnet_Balance;
    default:
      return "Invalid Network";
  }
}

export function mapNetworkNameToMissingBalanceColumn(
  selectedNetwork: NetworkNames,
  relayerData: RelayerBalance,
) {
  switch (selectedNetwork) {
    case NetworkNames.BTT_TESTNET:
      return relayerData.Missing_BTT_Donau_Testnet_Balance;
    case NetworkNames.BTT_MAINNET:
      return relayerData.Missing_BTT_Mainnet_Balance;
    default:
      return "";
  }
}

//This is used with the RelayerBalance DB Table!
export function mapNetworkNameToDBColumnNameString(
  selectedNetwork: NetworkNames,
) {
  switch (selectedNetwork) {
    case NetworkNames.BTT_TESTNET:
      return "BTT_Donau_Testnet_Balance";
    case NetworkNames.BTT_MAINNET:
      return "BTT_Mainnet_Balance";
    default:
      return "";
  }
}

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
};

export const ethereumCurrencies = [
  { name: "ETH", native: true, contractAddress: "" },
  { name: "USDC", native: false, contractAddress: "" },
];

export const bittorrentCurrencies = [{
  name: "BTT",
  native: true,
  contractAddress: "",
}, { name: "USDTM", native: false, contractAddress: DonauTestnetTokens.USDTM }];

export const bttMainnetCurrencies = [{
  name: "BTT",
  native: true,
  contractAddress: "",
}, {
  name: "USDD_t",
  native: false,
  contractAddress: "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1",
}, {
  name: "USDT_e",
  native: false,
  contractAddress: "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B",
}];

export const getCurrenciesForNetworkName: {
  [key in NetworkNames]: SelectableCurrency[];
} = {
  [NetworkNames.BTT_TESTNET]: bittorrentCurrencies,
  [NetworkNames.BTT_MAINNET]: bttMainnetCurrencies,
};

export const RelayerBalanceColumnNameByNetId: {
  [key in ChainIds]: string;
} = {
  [ChainIds.BTT_TESTNET_ID]: "BTT_Donau_Testnet_Balance",
  [ChainIds.BTT_MAINNET_ID]: "BTT_Mainnet_Balance",
};

export const MISSING_RelayerBalanceColumnNameByNetId: {
  [key in ChainIds]: string;
} = {
  [ChainIds.BTT_TESTNET_ID]: "Missing_BTT_Donau_Testnet_Balance",
  [ChainIds.BTT_MAINNET_ID]: "Missing_BTT_Mainnet_Balance",
};
