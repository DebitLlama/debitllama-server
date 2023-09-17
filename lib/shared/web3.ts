import { AccountTypes } from "../enums.ts";

export enum NetworkNames {
  BTT_TESTNET = "BTT Donau Testnet",
}
export const availableNetworks = [
  NetworkNames.BTT_TESTNET.toString(),
];

export enum NetworkTickers {
  BTT_TESTNET = "BTT",
}

export enum ChainIds {
  BTT_TESTNET_ID = "0x405",
}

export enum VirtualAccountsContractAddress {
  BTT_TESTNET = "0x870B0E3cf2c556dda20D3cB39e87145C21e8C023",
}

export enum ConnectedWalletsContractAddress {
  BTT_TESTNET = "0xaB9ADa67294C7f5F4690f23CEaEc4Ec6c4B14976",
}

export enum RPCURLS {
  BTT_TESTNET = "https://pre-rpc.bt.io/",
}

export enum EXPORERURLS {
  BTT_TESTNET = "https://testscan.bt.io",
}

export enum DonauTestnetTokens {
  USDTM = "0x4420a4415033bd22393d3A918EF8d2c9c62efD99",
}

export enum RelayerGasTrackerContractAddress {
  BTT_TESTNET = "0x3e4E07926c1c4AC9f29539E385fBbF700b49F221",
}

export const rpcUrl: { [key in ChainIds]: RPCURLS } = {
  [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
};

export const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
  [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
};

export const explorerUrlAddressPath: { [key in ChainIds]: string } = {
  [ChainIds.BTT_TESTNET_ID]: "/#/address/",
};

export const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
};

export const getVirtualAccountsContractAddress: {
  [keys in ChainIds]: VirtualAccountsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: VirtualAccountsContractAddress.BTT_TESTNET,
};

export const getConnectedWalletsContractAddress: {
  [keys in ChainIds]: ConnectedWalletsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: ConnectedWalletsContractAddress.BTT_TESTNET,
};

export const getAbiJsonByAccountType: {
    [keys in AccountTypes]: string;
} = {
  [AccountTypes.VIRTUALACCOUNT] : "/VirtualAccounts.json",
  [AccountTypes.CONNECTEDWALLET] : "/ConnectedWallets.json"
};

export const getRelayerGasTrackerContractAddress: {
  [keys in ChainIds]: RelayerGasTrackerContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: RelayerGasTrackerContractAddress.BTT_TESTNET,
};

export const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
};

export const chainIdFromNetworkName: { [key in NetworkNames]: ChainIds } = {
  [NetworkNames.BTT_TESTNET]: ChainIds.BTT_TESTNET_ID,
};

//This is used with the RelayerBalance DB Table!
export function mapNetworkNameToDBColumn(
  selectedNetwork: NetworkNames,
  relayerData: any,
) {
  switch (selectedNetwork) {
    case NetworkNames.BTT_TESTNET:
      return relayerData.BTT_Donau_Testnet_Balance;
    default:
      return "Invalid Network";
  }
}

export function mapNetworkNameToMissingBalanceColumn(
  selectedNetwork: NetworkNames,
  relayerData: any,
) {
  switch (selectedNetwork) {
    case NetworkNames.BTT_TESTNET:
      return relayerData.Missing_BTT_Donau_Testnet_Balance;
    default:
      break;
  }
}

//This is used with the RelayerBalance DB Table!
export function mapNetworkNameToDBColumnNameString(
  selectedNetwork: NetworkNames,
) {
  switch (selectedNetwork) {
    case NetworkNames.BTT_TESTNET:
      return "BTT_Donau_Testnet_Balance";
    default:
      return "";
  }
}

export function getChainExplorerForChainId(chainId: ChainIds, tx: string) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return `https://testnet.bttcscan.com/tx/${tx}`;

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

export const getCurrenciesForNetworkName: {
  [key in NetworkNames]: SelectableCurrency[];
} = {
  [NetworkNames.BTT_TESTNET]: bittorrentCurrencies,
};
