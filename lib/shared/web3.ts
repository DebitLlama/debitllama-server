import { AccountTypes } from "../enums.ts";

export const FeeDividerPerNetwork = {
  BTT_TESTNET: [20, "5%"], //value and the percentage
  BTT_MAINNET: [20, "5%"],
  ARBITRUM_SEPOLIA: [20, "5%"],
  ARBITRUM_MAINNET: [20, "5%"],
};

export function getAverageGasLimit() {
  return 400000n;
}

export enum NetworkNames {
  BTT_TESTNET = "BTT Donau Testnet",
  BTT_MAINNET = "BitTorrent Chain",
  ARBITRUM_SEPOLIA = "Arbitrum Sepolia Testnet",
  ARBITRUM_MAINNET = "Arbitrum Mainnet",
}
//TODO: add here new networks to select
export const availableNetworks = [
  // NetworkNames.BTT_MAINNET.toString(),
  // NetworkNames.BTT_TESTNET.toString(),
  NetworkNames.ARBITRUM_SEPOLIA.toString(),
  // NetworkNames.ARBITRUM_MAINNET.toString(),
];

export enum NetworkTickers {
  BTT_TESTNET = "BTT",
  BTT_MAINNET = "BTT",
  ARBITRUM_SEPOLIA = "ETH",
  ARBITRUM_MAINNET = "ETH",
}

export enum ChainIds {
  BTT_TESTNET_ID = "0x405", // 1029 - BitTorrent Chain (Donau testnet)
  BTT_MAINNET_ID = "0xc7", // 199 - BitTorrent Chain Mainnet
  ARBITRUM_SEPOLIA_ID = "0x66eee", // 421614 - Arbitrum Sepolia
  ARBITRUM_MAINNET_ID = "0xa4b1", // 42161 - Arbitrum One Mainnet
}

export const availableChainIds = [
  ChainIds.BTT_TESTNET_ID.toString(),
  ChainIds.BTT_MAINNET_ID.toString(),
  ChainIds.ARBITRUM_SEPOLIA_ID.toString(),
  ChainIds.ARBITRUM_MAINNET_ID.toString(),
];

export enum VirtualAccountsContractAddress {
  BTT_TESTNET = "0xF75515Df5AC843a8B261E232bB890dc2F75A4066",
  BTT_MAINNET = "0xc4Cf42D5a6F4F061cf5F98d0338FC5913b6fF581",
  ARBITRUM_SEPOLIA = "0x5586938a2fC4489661E868c5800769Fb10847fC5",
  ARBITRUM_MAINNET = "0x5586938a2fC4489661E868c5800769Fb10847fC5",
}

export enum ConnectedWalletsContractAddress {
  BTT_TESTNET = "0x9c85da9E45126Fd45BC62656026A2E7226bba239",
  BTT_MAINNET = "0xF9962f3C23De4e864E56ef29125D460c785905c6",
  ARBITRUM_SEPOLIA = "0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90",
  ARBITRUM_MAINNET = "0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90",
}

export enum RPCURLS {
  BTT_TESTNET = "https://pre-rpc.bt.io/",
  BTT_MAINNET = "https://rpc.bittorrentchain.io",
  ARBITRUM_SEPOLIA = "https://sepolia-rollup.arbitrum.io/rpc",
  ARBITRUM_MAINNET = "https://arb1.arbitrum.io/rpc",
}

export enum EXPORERURLS {
  BTT_TESTNET = "https://testscan.bt.io",
  BTT_MAINNET = "https://bttcscan.com",
  ARBITRUM_SEPOLIA = "https://sepolia.arbiscan.io",
  ARBITRUM_MAINNET = "https://arbiscan.io",
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
  [ChainIds.ARBITRUM_SEPOLIA_ID]: RPCURLS.ARBITRUM_SEPOLIA,
  [ChainIds.ARBITRUM_MAINNET_ID]: RPCURLS.ARBITRUM_MAINNET,
};

export const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
  [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: EXPORERURLS.BTT_MAINNET,
  [ChainIds.ARBITRUM_SEPOLIA_ID]: EXPORERURLS.ARBITRUM_SEPOLIA,
  [ChainIds.ARBITRUM_MAINNET_ID]: EXPORERURLS.ARBITRUM_MAINNET,
};

export const explorerUrlAddressPath: { [key in ChainIds]: string } = {
  [ChainIds.BTT_TESTNET_ID]: "/#/address/",
  [ChainIds.BTT_MAINNET_ID]: "/address/",
  [ChainIds.ARBITRUM_SEPOLIA_ID]: "/address/",
  [ChainIds.ARBITRUM_MAINNET_ID]: "/address/",
};

export const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: NetworkTickers.BTT_MAINNET,
  [ChainIds.ARBITRUM_SEPOLIA_ID]: NetworkTickers.ARBITRUM_SEPOLIA,
  [ChainIds.ARBITRUM_MAINNET_ID]: NetworkTickers.ARBITRUM_MAINNET,
};

export const mapNetworkNameToFeeDivider: { [key in NetworkNames]: string } = {
  [NetworkNames.BTT_MAINNET]: FeeDividerPerNetwork.BTT_MAINNET[1] as string,
  [NetworkNames.BTT_TESTNET]: FeeDividerPerNetwork.BTT_TESTNET[1] as string,
  [NetworkNames.ARBITRUM_SEPOLIA]: FeeDividerPerNetwork.ARBITRUM_SEPOLIA[1] as string,
  [NetworkNames.ARBITRUM_MAINNET]: FeeDividerPerNetwork.ARBITRUM_MAINNET[1] as string,
};

export const mapChainIdToFeePercentage: { [key in ChainIds]: string } = {
  [ChainIds.BTT_MAINNET_ID]: FeeDividerPerNetwork.BTT_MAINNET[1] as string,
  [ChainIds.BTT_TESTNET_ID]: FeeDividerPerNetwork.BTT_TESTNET[1] as string,
  [ChainIds.ARBITRUM_SEPOLIA_ID]: FeeDividerPerNetwork.ARBITRUM_SEPOLIA[1] as string,
  [ChainIds.ARBITRUM_MAINNET_ID]: FeeDividerPerNetwork.ARBITRUM_MAINNET[1] as string,
};
export const mapChainIdToFeeDivider: { [key in ChainIds]: number } = {
  [ChainIds.BTT_MAINNET_ID]: FeeDividerPerNetwork.BTT_MAINNET[0] as number,
  [ChainIds.BTT_TESTNET_ID]: FeeDividerPerNetwork.BTT_TESTNET[0] as number,
  [ChainIds.ARBITRUM_SEPOLIA_ID]: FeeDividerPerNetwork.ARBITRUM_SEPOLIA[0] as number,
  [ChainIds.ARBITRUM_MAINNET_ID]: FeeDividerPerNetwork.ARBITRUM_MAINNET[0] as number,
};

export const getVirtualAccountsContractAddress: {
  [keys in ChainIds]: VirtualAccountsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: VirtualAccountsContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: VirtualAccountsContractAddress.BTT_MAINNET,
  [ChainIds.ARBITRUM_SEPOLIA_ID]: VirtualAccountsContractAddress.ARBITRUM_SEPOLIA,
  [ChainIds.ARBITRUM_MAINNET_ID]: VirtualAccountsContractAddress.ARBITRUM_MAINNET,
};

export const getConnectedWalletsContractAddress: {
  [keys in ChainIds]: ConnectedWalletsContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: ConnectedWalletsContractAddress.BTT_TESTNET,
  [ChainIds.BTT_MAINNET_ID]: ConnectedWalletsContractAddress.BTT_MAINNET,
  [ChainIds.ARBITRUM_SEPOLIA_ID]: ConnectedWalletsContractAddress.ARBITRUM_SEPOLIA,
  [ChainIds.ARBITRUM_MAINNET_ID]: ConnectedWalletsContractAddress.ARBITRUM_MAINNET,
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
  [ChainIds.ARBITRUM_SEPOLIA_ID]: NetworkNames.ARBITRUM_SEPOLIA,
  [ChainIds.ARBITRUM_MAINNET_ID]: NetworkNames.ARBITRUM_MAINNET,
};

export const chainIdFromNetworkName: { [key in NetworkNames]: ChainIds } = {
  [NetworkNames.BTT_TESTNET]: ChainIds.BTT_TESTNET_ID,
  [NetworkNames.BTT_MAINNET]: ChainIds.BTT_MAINNET_ID,
  [NetworkNames.ARBITRUM_SEPOLIA]: ChainIds.ARBITRUM_SEPOLIA_ID,
  [NetworkNames.ARBITRUM_MAINNET]: ChainIds.ARBITRUM_MAINNET_ID,
};

export function getChainExplorerForChainId(chainId: ChainIds, tx: string) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return `https://testnet.bttcscan.com/tx/${tx}`;
    case ChainIds.BTT_MAINNET_ID:
      return `https://bttcscan.com/tx/${tx}`;
    case ChainIds.ARBITRUM_SEPOLIA_ID:
      return `https://sepolia.arbiscan.io/tx/${tx}`;
    case ChainIds.ARBITRUM_MAINNET_ID:
      return `https://arbiscan.io/tx/${tx}`;
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

export const arbitrumSepoliaCurrencies: SelectableCurrency[] = [
  {
    name: "ETH",
    native: true,
    contractAddress: "",
    minimumAmount: "0.001",
  },
  {
    name: "USDC",
    native: false,
    contractAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    minimumAmount: "0.0s1",
  },
  {
    name: "USDG",
    native: false,
    contractAddress: "0xFFC95faa3d63Cde504a05B567C600B78C0b41892",
    minimumAmount: "0.01"
  }
];

export const arbitrumMainnetCurrencies: SelectableCurrency[] = [
  {
    name: "ETH",
    native: true,
    contractAddress: "",
    minimumAmount: "0.001",
  },
  {
    name: "USDC",
    native: false,
    contractAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    minimumAmount: "1",
  },
];

export const getCurrenciesForNetworkName: {
  [key in NetworkNames]: SelectableCurrency[];
} = {
  [NetworkNames.BTT_TESTNET]: bittorrentCurrencies,
  [NetworkNames.BTT_MAINNET]: bttMainnetCurrencies,
  [NetworkNames.ARBITRUM_SEPOLIA]: arbitrumSepoliaCurrencies,
  [NetworkNames.ARBITRUM_MAINNET]: arbitrumMainnetCurrencies,
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
    name: NetworkNames.ARBITRUM_SEPOLIA,
    rpc: rpcUrl[ChainIds.ARBITRUM_SEPOLIA_ID],
    chain_id: ChainIds.ARBITRUM_SEPOLIA_ID,
    virtual_accounts_contract: VirtualAccountsContractAddress.ARBITRUM_SEPOLIA,
    connected_wallets_contract: ConnectedWalletsContractAddress.ARBITRUM_SEPOLIA,
    currency: "ETH",
    available_currencies: arbitrumSepoliaCurrencies.map((curr) => {
      return {
        name: curr.name,
        native: curr.native,
        contractAddress: curr.contractAddress,
      };
    }),
  },
  {
    name: NetworkNames.ARBITRUM_MAINNET,
    rpc: rpcUrl[ChainIds.ARBITRUM_MAINNET_ID],
    chain_id: ChainIds.ARBITRUM_MAINNET_ID,
    virtual_accounts_contract: VirtualAccountsContractAddress.ARBITRUM_MAINNET,
    connected_wallets_contract: ConnectedWalletsContractAddress.ARBITRUM_MAINNET,
    currency: "ETH",
    available_currencies: arbitrumMainnetCurrencies.map((curr) => {
      return {
        name: curr.name,
        native: curr.native,
        contractAddress: curr.contractAddress,
      };
    }),
  },
];


// BN254 scalar field modulus (r)
export const SNARK_FIELD_SIZE: bigint = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

export type NoteHex = `0x${string}`;

/**
 * Checks that `value` is a 0x-prefixed hex string of exactly `length` bytes
 * and that it encodes a valid BN254 field element (< r).
 */
export function isValidNoteHex(value: string, length = 32): value is NoteHex {
  if (typeof value !== "string") return false;

  // shape: "0x" + exactly length*2 hex chars
  const re = new RegExp(`^0x[0-9a-fA-F]{${length * 2}}$`);
  if (!re.test(value)) return false;

  // range: must be a field element
  return BigInt(value) < SNARK_FIELD_SIZE;
}