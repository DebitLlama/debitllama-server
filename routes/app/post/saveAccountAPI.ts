import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../../lib/backend/db/queryBuilder.ts";
import {
  errorResponseBuilder,
  successResponseBuilder,
} from "../../../lib/backend/responseBuilders.ts";
import { getAccount } from "../../../lib/backend/web3.ts";
import { AccountTypes } from "../../../lib/enums.ts";
import {
  ChainIds,
  getCurrenciesForNetworkName,
  networkNameFromId,
  rpcUrl,
} from "../../../lib/shared/web3.ts";
import { State } from "../../_middleware.ts";

//Save the newly created account!

export const handler: Handlers<any, State> = {
  async POST(_req, ctx) {
    const json = await _req.json();
    const commitment = json.commitment;
    const networkId = json.networkId;
    const name = json.name;
    const currency = json.currency;
    const accountType = json.accountType;

    const queryBuilder = new QueryBuilder(ctx);
    const select = queryBuilder.select();
    const networkExists = rpcUrl[networkId as ChainIds];
    if (!networkExists) {
      return errorResponseBuilder("Invalid Network!");
    }
    if (
      accountType !== AccountTypes.VIRTUALACCOUNT &&
      accountType !== AccountTypes.CONNECTEDWALLET
    ) {
      return errorResponseBuilder("Invalid Account Type");
    }

    //Verify if currency input is valid!
    const networkName = networkNameFromId[networkId as ChainIds];
    const currenciesFromNetworkName = getCurrenciesForNetworkName[networkName];
    const parsedCurrInput = JSON.parse(currency);
    const foundCurrency = currenciesFromNetworkName.filter((curr) => {
      return curr.name === parsedCurrInput.name &&
        curr.contractAddress === parsedCurrInput.contractAddress &&
        curr.native === parsedCurrInput.native;
    });

    if (foundCurrency.length !== 1) {
      return errorResponseBuilder("Invalid currency input!");
    }

    const accountData = await getAccount(commitment, networkId, accountType);

    if (accountData.exists) {
      // ..TODO? RPC CALL!
      const { data } = await select.Accounts.byCommitment(commitment);
      if (data.length !== 0) {
        return errorResponseBuilder("Account already exists!");
      }
      const insert = queryBuilder.insert();
      await insert.Accounts.newAccount(
        networkId,
        commitment,
        name,
        currency,
        accountData.account[3],
        accountType,
        accountData.account[1]
      );
      return successResponseBuilder("Account Saved");
    } else {
      return errorResponseBuilder("Unable to save account");
    }
  },
};
