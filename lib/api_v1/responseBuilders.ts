import {
  Account,
  AccountTypes,
  DebitItem,
  PaymentIntentRow,
} from "../enums.ts";
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
  Account_ApiV1,
  AccountTypes_ApiV1,
  accountTypesToV1,
  Currency_ApiV1,
  DebitItem_ApiV1,
  endpointDefinitions,
  EndpointNames_ApiV1,
  endpoints_ApiV1,
  ErrorResponse,
  Link,
  Network_ApiV1,
  PaginationResponse_ApiV1,
  PaymentIntent_ApiV1,
  PaymentIntentStatus_ApiV1,
  Pricing_ApiV1,
  v1_AccountResponse,
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
            contractAddress: curr.contractAddress,
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
            contractAddress: curr.contractAddress,
          };
        }),
      },
      commitment: acc.commitment,
      name: acc.name,
      closed: acc.closed,
      currency: {
        name: curr.name,
        native: curr.native,
        contractAddress: curr.contractAddress,
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
  commitment: string;
  data: Account | any;
  updatedBalance: string;
  updatedClosed: boolean;
  returnError: boolean;
  error: V1Error;
  missingPayments: Array<PaymentIntentRow>;
  allPaymentIntents: Array<PaymentIntentRow>;
  pagination: PaginationResponse_ApiV1 | object;
}

export function AccountResponseBuilder(args: AccountResponseBuilderProps) {
  const _self = {
    href: `/api/v1/accounts/${args.commitment}`,
    methods: endpoints_ApiV1[EndpointNames_ApiV1.accountsSlug],
  };
  const _version = "v1";
  const _description = endpointDefinitions[EndpointNames_ApiV1.accountsSlug];

  if (args.returnError) {
    const errorRes: ErrorResponse = {
      _self,
      _description,
      _version,
      _links: [{
        href: "/api/v1/accounts",
        methods: endpoints_ApiV1[EndpointNames_ApiV1.accounts],
      }],
      error: args.error,
    };
    return errorRes;
  }

  const networkId = args.data.network_id as ChainIds;
  const accountName = networkNameFromId[networkId];
  const currency = JSON.parse(args.data.currency);
  const network = {
    name: accountName,
    rpc: rpcUrl[networkId],
    chain_id: networkId,
    virtual_accounts_contract: getVirtualAccountsContractAddress[networkId],
    connected_wallets_contract: getVirtualAccountsContractAddress[networkId],
    currency: walletCurrency[networkId],
    available_currencies: getCurrenciesForNetworkName[accountName].map(
      (curr) => {
        return {
          name: curr.name,
          native: curr.native,
          contractAddress: curr.contractAddress,
        };
      },
    ),
  };
  // Gonna get all the payment intent links
  const paymentIntentsLinks = getLinksFromPaymentIntents(
    args.allPaymentIntents,
  );
  /// for the missing payment intents also
  const missingPaymentIntentsLinks = getLinksFromPaymentIntents(
    args.missingPayments,
  );
  // concant them
  const concattedLinks = paymentIntentsLinks;
  const savedHrefs = concattedLinks.map((link) => link.href);
  // cache the hrefs to filter out duplicate links
  for (let i = 0; i < missingPaymentIntentsLinks.length; i++) {
    if (!savedHrefs.includes(missingPaymentIntentsLinks[i].href)) {
      concattedLinks.push(missingPaymentIntentsLinks[i]);
    }
  }
  // Push the accounts url also!
  concattedLinks.push({
    href: "/api/v1/accounts",
    methods: endpoints_ApiV1[EndpointNames_ApiV1.accounts],
  });

  const body: v1_AccountResponse = {
    _self,
    _version,
    _description,
    _links: concattedLinks,
    all_payment_intents: {
      pagination: args.pagination as PaginationResponse_ApiV1,
      data: args.allPaymentIntents.map((row) =>
        mapPaymentIntentsRowToPaymentIntentsApiV1(
          row,
          currency,
          network,
          args.updatedBalance, //all the payment intents belong to the same account
          args.updatedClosed,
        )
      ),
    },
    missing_payments: args.missingPayments.map((row) => {
      return mapPaymentIntentsRowToPaymentIntentsApiV1(
        row,
        currency,
        network,
        args.updatedBalance, // all the paymetn intents belong to the same account
        args.updatedClosed,
      );
    }),
    account: mapAccountRowToAccountApiV1(
      args.data,
      currency,
      network,
      args.updatedBalance, // passing in the account balance separately
      args.updatedClosed,
    ),
  };

  return body;
}

function getLinksFromPaymentIntents(
  paymentIntentsRows: Array<PaymentIntentRow>,
): Array<Link> {
  return paymentIntentsRows.map((row) => {
    return {
      href: `/api/v1/payment_intents/${row.paymentIntent}`,
      methods: endpoints_ApiV1[EndpointNames_ApiV1.paymentIntentsSlug],
    };
  });
}

function mapPaymentIntentsRowToPaymentIntentsApiV1(
  row: PaymentIntentRow,
  currency: Currency_ApiV1,
  network: Network_ApiV1,
  updatedBalance: string, // Passing in the balance for the account connected to the payment intent row separately
  //to handle /accounts[slug] updated balance without refetching,
  // same goes for updateClosed
  updatedClosed: boolean,
): PaymentIntent_ApiV1 {
  return {
    id: row.id,
    created_at: row.created_at,
    account: mapAccountRowToAccountApiV1(
      row.account_id,
      currency,
      network,
      updatedBalance,
      updatedClosed,
    ),
    payee_address: row.payee_address,
    max_debit_amount: row.maxDebitAmount,
    debit_times: row.debitTimes,
    debit_interval: row.debitInterval,
    payment_intent: row.paymentIntent,
    commitment: row.commitment,
    estimated_gas: row.estimatedGas,
    status_text: row.statusText as PaymentIntentStatus_ApiV1,
    last_payment_date: row.lastPaymentDate,
    next_payment_date: row.nextPaymentDate,
    pricing: row.pricing as Pricing_ApiV1,
    currency,
    network,
    debit_item: mapDebitItemRowToApiV1(
      row.debit_item_id,
      currency,
      network,
    ),
    used_for: row.used_for,
    transactions_left: row.debitTimes - row.used_for,
    failed_dynamic_payment_amount: row.failedDynamicPaymentAmount,
  };
}

function mapAccountRowToAccountApiV1(
  account_id: Account,
  currency: Currency_ApiV1,
  network: Network_ApiV1,
  updatedBalance: string,
  updatedClosed: boolean,
): Account_ApiV1 {
  return {
    id: account_id.id,
    created_at: account_id.created_at,
    network,
    commitment: account_id.commitment,
    name: account_id.name,
    closed: updatedClosed,
    currency,
    balance: updatedBalance,
    account_type: account_id.accountType === AccountTypes.CONNECTEDWALLET
      ? AccountTypes_ApiV1.CONNECTEDWALLET
      : AccountTypes_ApiV1.VIRTUALACCOUNT,
    creator_address: account_id.creator_address,
  };
}

function mapDebitItemRowToApiV1(
  debit_item_id: DebitItem,
  currency: Currency_ApiV1,
  network: Network_ApiV1,
): DebitItem_ApiV1 {
  return {
    id: debit_item_id.id,
    created_at: debit_item_id.created_at,
    payee_address: debit_item_id.payee_address,
    currency,
    max_price: debit_item_id.max_price,
    debit_times: debit_item_id.debit_times,
    debit_interval: debit_item_id.debit_interval,
    button_id: debit_item_id.button_id,
    redirect_url: debit_item_id.redirect_url,
    pricing: debit_item_id.pricing as Pricing_ApiV1,
    network,
    name: debit_item_id.name,
    deleted: debit_item_id.deleted,
    payment_intents_count: debit_item_id.payment_intents_count,
  };
}
