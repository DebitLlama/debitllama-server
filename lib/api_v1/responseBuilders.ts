import { Account, AccountTypes } from "../enums.ts";
import {
  bittorrentCurrencies,
  ChainIds,
  ConnectedWalletsContractAddress,
  getCurrenciesForNetworkName,
  getVirtualAccountsContractAddress,
  networkNameFromId,
  NetworkNames,
  rpcUrl,
  VirtualAccountsContractAddress,
  walletCurrency,
} from "../shared/web3.ts";
import {
  accountTypesToV1,
  endpointDefinitions,
  EndpointNames_ApiV1,
  endpoints_ApiV1,
  ErrorResponse,
  Link,
  PaginationResponse_ApiV1,
  v1_AccountsResponse,
  v1_Index_Response,
  V1Error,
} from "./types.ts";

//There functions return the responses for the API endpoints!
export function v1Error(args: any, status: number) {
  return new Response(JSON.stringify(args), {
    status,
  });
}

export function v1Success(args: any) {
  return new Response(JSON.stringify(args), {
    status: 200,
  });
}

//These functions will convert fetched data to responses for the API endpoints!
// First one is for / and it's a generic response
export function V1ResponseBuilder() {
  const body: v1_Index_Response = {
    _self: {
      href: "/api/v1",
      methods: endpoints_ApiV1[EndpointNames_ApiV1.v1],
    },
    _version: "v1",
    _description: endpointDefinitions[EndpointNames_ApiV1.v1],
    _links: [
      {
        href: "/api/v1/accounts",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.accounts],
      },
      {
        href: "/api/v1/items",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.items],
      },
      {
        href: "/api/v1/payment_intents",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.paymentIntents],
      },
      {
        href: "/api/v1/relayer",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.relayer],
      },
      {
        href: "/api/v1/transactions",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.transactions],
      },
    ],
    artifacts: [
      { name: "ConnectedWallets", href: "/ConnectedWallets.json" },
      { name: "VirtualAccounts", href: "/VirtualAccounts.json" },
    ],
    supported_networks: [
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
            contract_address: curr.contractAddress,
          };
        }),
      },
    ],
  };
  return body;
}

export function V1ErrorResponseBuilder(error: V1Error) {
  const body: ErrorResponse = {
    _self: {
      href: "/api/v1/",
      methods: endpoints_ApiV1[EndpointNames_ApiV1.v1],
    },
    _version: "v1",
    _description: endpointDefinitions[EndpointNames_ApiV1.v1],
    _links: [
      {
        href: "/api/v1/accounts",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.accounts],
      },
      {
        href: "/api/v1/items",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.items],
      },
      {
        href: "/api/v1/payment_intents",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.paymentIntents],
      },
      {
        href: "/api/v1/relayer",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.relayer],
      },
      {
        href: "/api/v1/transactions",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.transactions],
      },
    ],
    error,
  };
  return body;
}

export interface AccountsResponseBuilderProps {
  data: Array<Account>; // The args are as coming from the database, but need to return API/v1 format after!!
  pagination: PaginationResponse_ApiV1 | object;
  returnError: boolean;
  error: V1Error;
}

export function AccountsResponseBuilder(args: AccountsResponseBuilderProps) {
  const _self = {
    href: "/api/v1/accounts",
    methods: endpoints_ApiV1[EndpointNames_ApiV1.accounts],
  };
  const _version = "v1";

  const _description = endpointDefinitions[EndpointNames_ApiV1.accounts];

  if (args.returnError) {
    const errorRes: ErrorResponse = {
      _self,
      _description,
      _version,
      _links: [_self],
      error: args.error,
    };
    return errorRes;
  }

  // Accounts access links
  const _links = args.data.map((acc) => {
    return {
      href: `/api/vi/accounts/${acc.commitment}`,
      methods: endpoints_ApiV1[EndpointNames_ApiV1.accountsSlug],
    };
  });

  //TODO: generate pagination links too!

  const accounts = args.data.map((acc) => {
    const curr = JSON.parse(acc.currency);
    const name = networkNameFromId[acc.network_id as ChainIds];
    return {
      id: acc.id,
      created_at: acc.created_at,
      network: {
        name,
        rpc: rpcUrl[acc.network_id as ChainIds],
        chain_id: acc.network_id,
        virtual_accounts_contract:
          getVirtualAccountsContractAddress[acc.network_id as ChainIds],
        connected_wallets_contract:
          getVirtualAccountsContractAddress[acc.network_id as ChainIds],
        currency: walletCurrency[acc.network_id as ChainIds],
        available_currencies: getCurrenciesForNetworkName[name].map((curr) => {
          return {
            name: curr.name,
            native: curr.native,
            contract_address: curr.contractAddress,
          };
        }),
      },
      commitment: acc.commitment,
      name: acc.name,
      closed: acc.closed,
      currency: {
        name: curr.name,
        native: curr.native,
        contract_address: curr.contractAddress,
      },
      balance: acc.balance,
      account_type: accountTypesToV1[acc.accountType as AccountTypes],
      creator_address: acc.creator_address,
    };
  });

  const pagination = args.pagination;
  // Todo add pagination links also based on the pagination args!

  const body: v1_AccountsResponse = {
    _self,
    _version,
    _description,
    _links,
    accounts,
    pagination: pagination as PaginationResponse_ApiV1,
  };
  return body;
}

// A function to build the responses for fetching a single account!

export interface AccountResponseBuilderProps {
  data: Account;
}

export function AccountResponseBuilder(args: AccountResponseBuilderProps) {
  const body = {};

  return body;
}
