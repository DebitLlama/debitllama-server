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

export enum DirectDebitContractAddress {
  BTT_TESTNET = "0x003E9E692029118e110c9A73a37B62b04D3d79e9",
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

export const rpcUrl: { [key in ChainIds]: RPCURLS } = {
  [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
};

export const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
  [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
};

export const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
};

export const getDirectDebitContractAddress: {
  [keys in ChainIds]: DirectDebitContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: DirectDebitContractAddress.BTT_TESTNET,
};

export const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
};

export const chainIdFromNetworkName: { [key in NetworkNames]: ChainIds } = {
  [NetworkNames.BTT_TESTNET]: ChainIds.BTT_TESTNET_ID,
};