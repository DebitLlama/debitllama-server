import { AccountTypes } from "../enums.ts";

export const FeeDividerPerNetwork = {
  BTT_TESTNET: [20, "5%"], //value and the percentage
  BTT_MAINNET: [20, "5%"],
  AVAX_MAINNET: [20, "5%"],
};

export function getAverageGasLimit() {
  return 400000n;
}

export enum NetworkNames {
  BTT_TESTNET = "BTT Donau Testnet",
  BTT_MAINNET = "BitTorrent Chain",
  AVAX_MAINNET = "Avalanche Mainnet C-Chain",
}
//TODO: add here new networks to select
export const availableNetworks = [
  NetworkNames.BTT_MAINNET.toString(),
  NetworkNames.BTT_TESTNET.toString(),
];

export enum NetworkTickers {
  BTT_TESTNET = "BTT",
  BTT_MAINNET = "BTT",
  AVAX_MAINNET = "AVAX",
}

export enum ChainIds {
  BTT_TESTNET_ID = "0x405",
  BTT_MAINNET_ID = "0xc7",
  AVAX_MAINNET = "0xA86A",
}

export const availableChainIds = [
  ChainIds.BTT_TESTNET_ID.toString(),
  ChainIds.BTT_MAINNET_ID.toString(),
  ChainIds.AVAX_MAINNET.toString(),
];

export enum VirtualAccountsContractAddress {
  BTT_TESTNET = "0xF75515Df5AC843a8B261E232bB890dc2F75A4066",
  BTT_MAINNET = "0xc4Cf42D5a6F4F061cf5F98d0338FC5913b6fF581",
  AVAX_MAINNET = "TODO:",
}

export enum ConnectedWalletsContractAddress {
  BTT_TESTNET = "0x9c85da9E45126Fd45BC62656026A2E7226bba239",
  BTT_MAINNET = "0xF9962f3C23De4e864E56ef29125D460c785905c6",
  AVAX_MAINNET = "TODO:",
}

export enum RPCURLS {
  BTT_TESTNET = "https://pre-rpc.bt.io/",
  BTT_MAINNET = "https://rpc.bittorrentchain.io",
  AVAX_MAINNET = "https://api.avax.network/ext/bc/C/rpc",
}

export enum EXPORERURLS {
  BTT_TESTNET = "https://testscan.bt.io",
  BTT_MAINNET = "https://bttcscan.com",
  AVAX_MAINNET = "https://avascan.info/",
}

export enum DonauTestnetTokens {
  USDTM = "0x4420a4415033bd22393d3A918EF8d2c9c62efD99",
}

export enum BTTMAinnetTokens {
  USDD_t = "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1",
  USDT_e = "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B",
}

export const rpcUrl: { [key in ChainIds]: RPCURLS } = {
  [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: RPCURLS.BTT_MAINNET,
  [ChainIds.AVAX_MAINNET]: RPCURLS.AVAX_MAINNET,
};

export const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
  [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: EXPORERURLS.BTT_MAINNET,
  [ChainIds.AVAX_MAINNET]: EXPORERURLS.AVAX_MAINNET,
};

export const explorerUrlAddressPath: { [key in ChainIds]: string } = {
  [ChainIds.BTT_TESTNET_ID]: "/#/address/",
  [ChainIds.BTT_MAINNET_ID]: "/address/",
  [ChainIds.AVAX_MAINNET]: "/blockchain/c/address/",
};

export const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: NetworkTickers.BTT_MAINNET,
  [ChainIds.AVAX_MAINNET]: NetworkTickers.AVAX_MAINNET,
};

export const mapNetworkNameToFeeDivider: { [key in NetworkNames]: string } = {
  [NetworkNames.BTT_MAINNET]: FeeDividerPerNetwork.BTT_MAINNET[1] as string,
  [NetworkNames.BTT_TESTNET]: FeeDividerPerNetwork.BTT_TESTNET[1] as string,
  [NetworkNames.AVAX_MAINNET]: FeeDividerPerNetwork.AVAX_MAINNET[1] as string,
};

export const mapChainIdToFeePercentage: { [key in ChainIds]: string } = {
  [ChainIds.BTT_MAINNET_ID]: FeeDividerPerNetwork.BTT_MAINNET[1] as string,
  [ChainIds.BTT_TESTNET_ID]: FeeDividerPerNetwork.BTT_TESTNET[1] as string,
  [ChainIds.AVAX_MAINNET]: FeeDividerPerNetwork.AVAX_MAINNET[1] as string,
};
export const mapChainIdToFeeDivider: { [key in ChainIds]: number } = {
  [ChainIds.BTT_MAINNET_ID]: FeeDividerPerNetwork.BTT_MAINNET[0] as number,
  [ChainIds.BTT_TESTNET_ID]: FeeDividerPerNetwork.BTT_TESTNET[0] as number,
  [ChainIds.AVAX_MAINNET]: FeeDividerPerNetwork.AVAX_MAINNET[0] as number,
};

export const getVirtualAccountsContractAddress: {
  [keys in ChainIds]: VirtualAccountsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: VirtualAccountsContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: VirtualAccountsContractAddress.BTT_MAINNET,
  [ChainIds.AVAX_MAINNET]: VirtualAccountsContractAddress.AVAX_MAINNET,
};

export const getConnectedWalletsContractAddress: {
  [keys in ChainIds]: ConnectedWalletsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: ConnectedWalletsContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: ConnectedWalletsContractAddress.BTT_MAINNET,
  [ChainIds.AVAX_MAINNET]: ConnectedWalletsContractAddress.AVAX_MAINNET,
};

export const getAbiJsonByAccountType: {
  [keys in AccountTypes]: string;
} = {
  [AccountTypes.VIRTUALACCOUNT]: "/VirtualAccounts.json",
  [AccountTypes.CONNECTEDWALLET]: "/ConnectedWallets.json",
};

export const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: NetworkNames.BTT_MAINNET,
  [ChainIds.AVAX_MAINNET]: NetworkNames.AVAX_MAINNET,
};

export const chainIdFromNetworkName: { [key in NetworkNames]: ChainIds } = {
  [NetworkNames.BTT_TESTNET]: ChainIds.BTT_TESTNET_ID,
  [NetworkNames.BTT_MAINNET]: ChainIds.BTT_MAINNET_ID,
  [NetworkNames.AVAX_MAINNET]: ChainIds.AVAX_MAINNET,
};

export function getChainExplorerForChainId(chainId: ChainIds, tx: string) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return `https://testnet.bttcscan.com/tx/${tx}`;
    case ChainIds.BTT_MAINNET_ID:
      return `https://bttcscan.com/tx/${tx}`;
    case ChainIds.AVAX_MAINNET:
      return `https://avascan.info/blockchain/c/tx/${tx}`;
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

export const avaxCurrencies: SelectableCurrency[] = [
  // {
  //   name: "AVAX",
  //   native: true,
  //   contractAddress: "",
  //   minimumAmount: "0.1",
  // },
  {
    name: "USDC",
    native: false,
    contractAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    minimumAmount: "10",
  },
  {
    name: "EURC",
    native: false,
    contractAddress: "0xc891eb4cbdeff6e073e859e987815ed1505c2acd",
    minimumAmount: "10",
  },
];

export const getCurrenciesForNetworkName: {
  [key in NetworkNames]: SelectableCurrency[];
} = {
  [NetworkNames.BTT_TESTNET]: bittorrentCurrencies,
  [NetworkNames.BTT_MAINNET]: bttMainnetCurrencies,
  [NetworkNames.AVAX_MAINNET]: avaxCurrencies,
};

export const responseBuildersSupportedNetworks = [
  {
    name: NetworkNames.BTT_TESTNET,
    rpc: rpcUrl[ChainIds.BTT_TESTNET_ID],
    chain_id: ChainIds.BTT_TESTNET_ID,
    virtual_accounts_contract: VirtualAccountsContractAddress.BTT_TESTNET,
    connected_wallets_contract: ConnectedWalletsContractAddress.BTT_TESTNET,
    currency: "BTT",
    available_currencies: bittorrentCurrencies.map((curr) => {
      return {
        name: curr.name,
        native: curr.native,
        contractAddress: curr.contractAddress,
      };
    }),
  },
  {
    name: NetworkNames.BTT_MAINNET,
    rpc: rpcUrl[ChainIds.BTT_MAINNET_ID],
    chain_id: ChainIds.BTT_MAINNET_ID,
    virtual_accounts_contract: VirtualAccountsContractAddress.BTT_MAINNET,
    connected_wallets_contract: ConnectedWalletsContractAddress.BTT_MAINNET,
    currency: "BTT",
    available_currencies: bttMainnetCurrencies.map((curr) => {
      return {
        name: curr.name,
        native: curr.native,
        contractAddress: curr.contractAddress,
      };
    }),
  },
  {
    name: NetworkNames.AVAX_MAINNET,
    rpc: rpcUrl[ChainIds.AVAX_MAINNET],
    chain_id: ChainIds.AVAX_MAINNET,
    virtual_accounts_contract: VirtualAccountsContractAddress.AVAX_MAINNET,
    connected_wallets_contract: ConnectedWalletsContractAddress.AVAX_MAINNET,
    currency: "AVAX",
    available_currencies: avaxCurrencies.map((curr) => {
      return {
        name: curr.name,
        native: curr.native,
        contractAddress: curr.contractAddress,
      };
    }),
  },
];
