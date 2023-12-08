// Initialize relayer balances using a queue
import { Relayer_balances_by_networkRow } from "../../enums.ts";
import { availableChainIds } from "../../shared/web3.ts";
import {
  bulkInitNewRelayerBalances,
  selectAllRelayerBalancesByUserId,
} from "../db/tables/Relayer_balances_by_network.ts";
import { getContext } from "./utils.ts";

/**
 * insertMissingRelayerBalances will initialize the new relayer balances table for the users with available networks on each log in
 * @param user_id
 */

export async function initRelayerBalances({user_id} : {user_id: string}) {
  // If a relayer balance network is missing, add a new row
  const ctx = getContext();

  const { data: relayerBalances, error: _selectErr } =
    await selectAllRelayerBalancesByUserId(
      ctx,
      { user_id },
    );

  if (relayerBalances.length < availableChainIds.length) {
    const toBulkCreate: Relayer_balances_by_networkRow[] = [];

    // Find the rows that are missing and insert a new one
    for (let i = 0; i < availableChainIds.length; i++) {
      const networkBalances = relayerBalances.filter((
        row: Relayer_balances_by_networkRow,
      ) => row.network === availableChainIds[i]);
      if (networkBalances.length === 0) {
        toBulkCreate.push({
          created_at: new Date().toUTCString(),
          user_id,
          network: availableChainIds[i],
          balance: "0",
          missing_balance: "0",
          last_topup: new Date().toUTCString(),
        });
      }
    }
    const { error: insertErr } = await bulkInitNewRelayerBalances(ctx, {
      user_id,
      initData: toBulkCreate,
    });

    if (insertErr) {
      console.log(insertErr);
    }
  }
}
