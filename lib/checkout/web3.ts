import { handleError } from "../../components/Checkout/HandleCheckoutError.ts";
import { AccountAccess, AccountTypes } from "../enums.ts";
import {
  requestBalanceRefresh,
  saveAccount,
  uploadProfileData,
} from "../frontend/fetch.ts";
import {
  approveSpend,
  connectedWalletAlready,
  connectWallet,
  depositEth,
  depositToken,
  getAllowance,
  getContract,
  handleNetworkSelect,
  parseEther,
  requestAccounts,
  switch_setupAccount,
  topUpETH,
  topUpTokens,
} from "../frontend/web3.ts";
import {
  ChainIds,
  getAbiJsonByAccountType,
  getConnectedWalletsContractAddress,
  getVirtualAccountsContractAddress,
} from "../shared/web3.ts";
import {
  Currency,
  onCreateAccountSubmitArgs,
  TopupBalanceArgs,
} from "../types/checkoutTypes.ts";

export async function handleEthTopup(
  contract: any,
  commitment: string,
  amount: string,
  chainId: string,
  handleError: CallableFunction,
  setShowOverlay: (to: boolean) => void,
) {
  setShowOverlay(true);
  const topuptx = await topUpETH(
    contract,
    commitment,
    amount,
  ).catch((err) => {
    setShowOverlay(false);
  });
  if (topuptx !== undefined) {
    await topuptx.wait().then(async (receipt: any) => {
      if (receipt.status === 1) {
        const res = await requestBalanceRefresh(commitment, chainId, "buyPage");
        if (res !== 200) {
          handleError("An error occured saving the balance!");
          setShowOverlay(false);
        } else {
          location.reload();
        }
      } else {
        setShowOverlay(false);
      }
    }).catch((err: any) => {
      setShowOverlay(false);
    });
  }
}

export async function handleTokenTopup(
  contract: any,
  commitment: string,
  amount: string,
  chainId: string,
  handleError: CallableFunction,
  setShowOverlay: (to: boolean) => void,
) {
  setShowOverlay(true);
  const topuptx = await topUpTokens(
    contract,
    commitment,
    amount,
  ).catch((err: any) => {
    handleError("Unable to send transaction");
    console.error(err);
    setShowOverlay(false);
  });

  if (topuptx !== undefined) {
    await topuptx.wait().then(async (receipt: any) => {
      if (receipt.status === 1) {
        const res = await requestBalanceRefresh(commitment, chainId, "buyPage");
        if (res !== 200) {
          handleError("An error occured saving the balance!");
          setShowOverlay(false);
        } else {
          location.reload();
        }
      } else {
        setShowOverlay(false);
      }
    }).catch((err: any) => {
      setShowOverlay(false);
    });
  }
}

export function topupbalance(args: TopupBalanceArgs) {
  const debitContractAddress =
    getVirtualAccountsContractAddress[args.chainId as ChainIds];
  return async () => {
    // I need to connect the wallet do the onboarding and then do the transaction if all the conditions are met!
    const provider = await handleNetworkSelect(args.chainId, args.handleError);
    if (!provider) {
      return;
    }
    const address = await requestAccounts();

    if (args.currency.native) {
      const contract = await getContract(
        provider,
        debitContractAddress,
        "/VirtualAccounts.json",
      );

      await handleEthTopup(
        contract,
        args.commitment,
        args.topupAmount.toString(),
        args.chainId,
        args.handleError,
        args.setShowOverlay,
      );
    } else {
      const erc20Contract = await getContract(
        provider,
        args.currency.contractAddress,
        "/ERC20.json",
      );

      const allowance: bigint = await getAllowance(
        erc20Contract,
        address,
        debitContractAddress,
      );
      const contract = await getContract(
        provider,
        debitContractAddress,
        "/VirtualAccounts.json",
      );
      if (allowance >= parseEther(args.topupAmount.toString())) {
        // Just do the top up
        await handleTokenTopup(
          contract,
          args.commitment,
          args.topupAmount.toString(),
          args.chainId,
          args.handleError,
          args.setShowOverlay,
        );
      } else {
        // Add allowance and then deposit
        const approveTx = await approveSpend(
          erc20Contract,
          debitContractAddress,
          args.topupAmount.toString(),
        );

        if (approveTx !== undefined) {
          await approveTx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
              await handleTokenTopup(
                contract,
                args.commitment,
                args.topupAmount.toString(),
                args.chainId,
                args.handleError,
                args.setShowOverlay,
              );
            }
          });
        }
      }
    }
  };
}

export function approveBalance(args: TopupBalanceArgs) {
  const debitContractAddress =
    getConnectedWalletsContractAddress[args.chainId as ChainIds];

  return async () => {
    // I need to connect the wallet do the onboarding and then do the transaction if all the conditions are met!
    const provider = await handleNetworkSelect(args.chainId, args.handleError);
    if (!provider) {
      return;
    }
    const erc20Contract = await getContract(
      provider,
      args.currency.contractAddress,
      "/ERC20.json",
    );

    args.setShowOverlay(true);
    // Add allowance and then deposit
    const approveTx = await approveSpend(
      erc20Contract,
      debitContractAddress,
      args.topupAmount.toString(),
    ).catch((err: any) => {
      args.setShowOverlay(false);
    });

    if (approveTx !== undefined) {
      await approveTx.wait().then(async (receipt: any) => {
        if (receipt.status === 1) {
          const res = await requestBalanceRefresh(
            args.commitment,
            args.chainId,
            "buyPage",
          );
          if (res !== 200) {
            handleError("An error occured saving the balance!");
            args.setShowOverlay(false);
          } else {
            location.reload();
          }
        }
      });
    }
  };
}

export function refreshBalanceClick(args: TopupBalanceArgs) {
  return async () => {
    const res = await requestBalanceRefresh(
      args.commitment,
      args.chainId,
      "buyPage",
    );
    if (res !== 200) {
      handleError("An error occured saving the balance!");
    } else {
      location.reload();
    }
  };
}

export async function handleTokenTX(
  debitcontract: any,
  virtualaccount: {
    encryptedNote: any;
    commitment: any;
  },
  erc20Contract: string,
  chainId: string,
  depositAmount: string,
  accountName: string,
  selectedCurrency: Currency,
  setShowOverlay: (to: boolean) => void,
  selectedAccountType: AccountTypes,
  accountAccessSelected: AccountAccess
  ) { // The TX is either a deposit or a connected wallet!
  const tx = selectedAccountType === AccountTypes.VIRTUALACCOUNT
    ? await depositToken(
      debitcontract,
      virtualaccount.commitment,
      depositAmount,
      erc20Contract,
      virtualaccount.encryptedNote,
    ).catch((err) => {
      setShowOverlay(false);
    })
    : await connectWallet(
      debitcontract,
      virtualaccount.commitment,
      erc20Contract,
      virtualaccount.encryptedNote,
    ).catch((err) => {
      setShowOverlay(false);
    });

  if (tx !== undefined) {
    await tx.wait().then(async (receipt: any) => {
      if (receipt.status === 1) {
        const resp = await saveAccount({
          name: accountName,
          networkId: chainId,
          commitment: virtualaccount.commitment,
          currency: JSON.stringify(selectedCurrency),
          accountType: selectedAccountType,
          accountAccess: accountAccessSelected,
        });
        if (resp.status === 500) {
          setShowOverlay(false);
        } else {
          location.reload();
        }
      } else {
        setShowOverlay(false);
      }
    }).catch((err: any) => {
      setShowOverlay(false);
    });
  }
}

export function onCreateAccountSubmit(args: onCreateAccountSubmitArgs) {
  return async (e: any) => {
    e.preventDefault();

    const accountName = e.target.accountName.value;

    const provider = await handleNetworkSelect(args.chainId, args.handleError);

    if (!provider) {
      return;
    }
    const address = await requestAccounts();

    if (!args.profileExists) {
      const uploadProfileStatus = await uploadProfileData({
        firstname: args.profile.firstname,
        lastname: args.profile.lastname,
        addressline1: args.profile.addressLine1,
        addressline2: args.profile.addressLine2,
        city: args.profile.city,
        postcode: args.profile.postcode,
        country: args.profile.country,
      });

      if (uploadProfileStatus !== 200) {
        handleError("Unable to upload profile");
        return;
      }
    }
    const [virtualaccount, error, errorMessage] =
      await switch_setupAccount(
        args.ethEncryptPublicKey,
        args.passwordProps.password,
        address,
        args.accountAccessSelected,
      );

    if (error) {
      handleError(errorMessage);
      return;
    }

    const debitContractAddress =
      args.accountTypeSwitchValue === AccountTypes.VIRTUALACCOUNT
        ? getVirtualAccountsContractAddress[args.chainId as ChainIds]
        : getConnectedWalletsContractAddress[args.chainId as ChainIds];

    if (args.accountTypeSwitchValue === AccountTypes.CONNECTEDWALLET) {
      // I just connect the wallet and the approval needs to happen on the top up page where I will navigate to after.
      const contract = await getContract(
        provider,
        debitContractAddress,
        "/ConnectedWallets.json",
      );

      //Check if the connected wallet already exists, and if yes, show an error!
      const connectedAlready = await connectedWalletAlready(
        contract,
        address,
        args.selectedCurrency.contractAddress,
      );

      if (connectedAlready) {
        handleError("You already have a wallet connected to that token!");
        return;
      }
    }

    const debitContract = await getContract(
      provider,
      debitContractAddress,
      getAbiJsonByAccountType[args.accountTypeSwitchValue],
    );

    if (!args.selectedCurrency?.native) {
      //Approve spending, Then do the deposit

      const erc20Contract = await getContract(
        provider,
        args.selectedCurrency.contractAddress,
        "/ERC20.json",
      );

      const allowance: bigint = await getAllowance(
        erc20Contract,
        address,
        debitContractAddress,
      );
      args.setShowOverlay(true);

      if (allowance >= parseEther(args.depositAmount)) {
        // Just deposit
        await handleTokenTX(
          debitContract,
          virtualaccount,
          erc20Contract,
          args.chainId,
          args.depositAmount,
          accountName,
          args.selectedCurrency,
          args.setShowOverlay,
          args.accountTypeSwitchValue,
          args.accountAccessSelected,
        ).catch((err: any) => {
          args.setShowOverlay(false);
        });
      } else {
        // Add allowance and then deposit
        const approveTx = await approveSpend(
          erc20Contract,
          debitContractAddress,
          args.depositAmount,
        ).catch((err: any) => {
          args.setShowOverlay(false);
        });

        if (approveTx !== undefined) {
          await approveTx.wait().then(async (receipt: any) => {
            if (receipt.status === 1) {
              await handleTokenTX(
                debitContract,
                virtualaccount,
                erc20Contract,
                args.chainId,
                args.depositAmount,
                accountName,
                args.selectedCurrency,
                args.setShowOverlay,
                args.accountTypeSwitchValue,
                args.accountAccessSelected,
              ).catch((err: any) => {
                args.setShowOverlay(false);
              });
            }
          }).catch((err: any) => {
            args.setShowOverlay(false);
          });
        }
      }
    } else {
      args.setShowOverlay(true);
      const tx = await depositEth(
        debitContract,
        virtualaccount.commitment,
        args.depositAmount,
        virtualaccount.encryptedNote,
      ).catch((err) => {
        args.setShowOverlay(false);
      });

      if (tx !== undefined) {
        await tx.wait().then(async (receipt: any) => {
          if (receipt.status === 1) {
            const resp = await saveAccount(
              {
                name: accountName,
                networkId: args.chainId,
                commitment: virtualaccount.commitment,
                currency: JSON.stringify(args.selectedCurrency),
                accountType: AccountTypes.VIRTUALACCOUNT,
                accountAccess: args.accountAccessSelected,
              },
            );
            if (resp.status === 500) {
              args.setShowOverlay(false);
            } else {
              location.reload();
            }
          } else {
            args.setShowOverlay(false);
          }
        }).catch((err: any) => {
          args.setShowOverlay(false);
        });
      }
    }
  };
}
