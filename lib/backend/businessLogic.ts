import { PaymentIntentRow, PaymentIntentStatus, RelayerBalance } from "../enums.ts";
import { ChainIds } from "../shared/web3.ts";
import QueryBuilder from "./queryBuilder.ts";
import {
getProvider,
  parseEther,
} from "./web3.ts";

export async function updateRelayerBalanceAndHistorySwitchNetwork(
  chainId: ChainIds,
  queryBuilder: QueryBuilder,
  addedBalance: string,
  transactionHash: string,
) {
  const select = queryBuilder.select();
  const update = queryBuilder.update();
  const insert = queryBuilder.insert();

  const { data: relayerBalance } = await select.RelayerBalance.byUserId();

  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID: {
      const bttBalance = parseEther(
        `${relayerBalance[0].BTT_Donau_Testnet_Balance}`,
      );
      const newBalance = parseEther(addedBalance) + bttBalance;
      const missingBalance = parseEther(
        relayerBalance[0].Missing_BTT_Donau_Testnet_Balance,
      );
      const newMissingBalance = calculateNewMissingBalance(
        missingBalance,
        parseEther(addedBalance),
      );
      const id = relayerBalance[0].id;

      await update.RelayerBalance.Missing_BTT_Donau_Testnet_BalanceById(
        newBalance,
        newMissingBalance,
        id,
      );

      await insert.RelayerTopUpHistory.newRow(
        transactionHash,
        chainId,
        addedBalance,
      );

      // Find payment intents that I can set to Created or recurring depending on if it's the first transaction
      // Depending on How much balance was added to the relayer and how much was the missing balance
      const {
        data: paymentIntentsWithLowBalance,
      } = await select.PaymentIntents.byRelayerBalanceTooLowAndUserIdForPayee(
        chainId,
      );

      const feeData = await getGasPrice(
        ChainIds.BTT_TESTNET_ID,
      );
      const resetablePaymentIntents = await findPaymentIntentsThatCanBeReset(
        addedBalance,
        paymentIntentsWithLowBalance,
        feeData,
      );
      //set these resetable payment intents to created or recurring

      for (let i = 0; i < resetablePaymentIntents.length; i++) {
        const piToReset = resetablePaymentIntents[i];
        if (piToReset.used_for === 0) {
          // Set to created!
          await update.PaymentIntents.statusByPaymentIntent(
            PaymentIntentStatus.CREATED,
            piToReset.paymentIntent,
          );
        } else {
          // set to recurring!
          await update.PaymentIntents.statusByPaymentIntent(
            PaymentIntentStatus.RECURRING,
            piToReset.paymentIntent,
          );
        }
      }

      break;
    }
    default:
      console.log("default case triggers");
      break;
  }
}
export function findPaymentIntentsThatCanBeReset(
  addedBalance: string,
  paymentIntentsRows: Array<PaymentIntentRow>,
  feeData: any,
) {
  const parsedAddedBalance = parseEther(addedBalance);
  const resumablePaymentIntents = new Array<PaymentIntentRow>();

  let addedBalanceLeft = parsedAddedBalance;
  let missingGas = BigInt(0);
  for (let i = 0; i < paymentIntentsRows.length; i++) {
    const pi = paymentIntentsRows[i];
    const totalFee = calculateGasEstimationPerChain(
      pi.network as ChainIds,
      feeData,
      increaseGasLimit(BigInt(pi.estimatedGas)),
    );
    missingGas += totalFee === null ? BigInt(0) : totalFee;
    if (totalFee) {
      if (addedBalanceLeft - totalFee >= 0) {
        resumablePaymentIntents.push(pi);
        addedBalanceLeft -= totalFee;
      }
    }
  }
  return resumablePaymentIntents;
}

//This is business logic
function calculateNewMissingBalance(
  missingBalance: bigint,
  addedBalance: bigint,
): bigint {
  if (missingBalance === BigInt(0)) {
    return BigInt(0);
  }
  const newBalance = missingBalance - addedBalance;
  if (newBalance < 0) {
    return BigInt(0);
  } else {
    return newBalance;
  }
}

export async function updateRelayerBalanceWithAllocatedAmount(
  queryBuilder: QueryBuilder,
  relayerBalance_id: number,
  chainId: ChainIds,
  currentRelayerBalance: string,
  oldAllocatedBalance: string,
  newAllocatedBalance: string,
) {
  const update = queryBuilder.update();
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID: {
      const current = parseEther(currentRelayerBalance);
      const oldAllocation = parseEther(oldAllocatedBalance);
      const newAllocation = parseEther(newAllocatedBalance);
      const newRelayerBalance = (current + oldAllocation) - newAllocation;
      return await update.RelayerBalance.BTT_Donau_Testnet_BalanceById(
        newRelayerBalance,
        relayerBalance_id,
      );
    }
    default:
      break;
  }
}

/**
 * increase the gas limit by 30 percent to make sure the value we use is enough!
 * @param estimatedGasLimit
 * @returns bigint
 */

export const increaseGasLimit = (estimatedGasLimit: bigint) => {
  return (estimatedGasLimit * BigInt(130)) / BigInt(100); // increase by 30%
};

/**
 *  get the gas price for the chainId
 * @param chainId
 * @returns feeData
 */

export async function getGasPrice(chainId: ChainIds) {
  const provider = getProvider(chainId);

  const feeData = await provider.getFeeData();

  return {
    gasPrice: feeData.gasPrice,
    maxFeePerGas: feeData.maxFeePerGas === null
      ? BigInt(0)
      : feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas === null
      ? BigInt(0)
      : feeData.maxPriorityFeePerGas,
  };
}

/**
 * Calculate the gas estimation for a dynamic payment request using the chainid and fee data and an increased gas limit
 * @param chainId
 */

export function calculateGasEstimationPerChain(
  chainId: ChainIds,
  feeData: {
    gasPrice: bigint | null;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  },
  increasedEstimatedGas: bigint,
) {
  if (feeData.gasPrice === null) {
    return null;
  }
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return feeData.gasPrice * increasedEstimatedGas;
    default:
      return null;
  }
}

/**
 * Different chains have different rows in the DB for relayer balance!
 * Use this function to access them!
 * @param chainId
 * @param relayerBalance
 * @returns string relayer balance
 */

export function getRelayerBalanceForChainId(
  chainId: ChainIds,
  relayerBalance: RelayerBalance,
) {
  switch (chainId) {
    case ChainIds.BTT_TESTNET_ID:
      return relayerBalance.BTT_Donau_Testnet_Balance;
    default:
      return "0";
  }
}
