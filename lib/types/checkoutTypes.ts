import { ProfileProps } from "../../components/BuyPageProfile.tsx";
import { AccountPasswordInputProps } from "../../islands/accountPasswordInput.tsx";
import { AccountTypes } from "../enums.ts";

export interface Currency {
  name: string;
  native: boolean;
  contractAddress: string;
}

export interface ItemProps {
  payeeAddress: string;
  currency: Currency;
  maxPrice: string;
  debitTimes: number;
  debitInterval: number;
  buttonId: string;
  redirectUrl: string;
  pricing: string;
  network: string;
  name: string;
}

export interface BuyButtonPageProps {
  isLoggedIn: boolean;
  item: ItemProps;
  url: string;
  accounts: any;
  profileExists: boolean;
  ethEncryptPublicKey: string;
  requires2Fa: boolean;
}

export interface RenderPurchaseDetails {
  name: string;
  network: string;
  type: string;
  pricing: string;
  maxDebitAmount: string;
  debitInterval: string;
  debitTimes: string;
}

export type ShowOverlayError = {
  showError: boolean;
  message: string;
  action: () => void;
};

export interface ButtonsBasedOnSelectionProps {
  item: ItemProps;
  selected: number;
  accounts: any;
  paymentAmount: string;
  newAccountPasswordProps: AccountPasswordInputProps;
  setNewAccountPasswordStrengthNotification: (to: string) => void;
  newAccountPasswordScore: number;
  setNewAccountPasswordScore: (to: number) => void;
  setNewAccountPasswordMatchError: (to: string) => void;
  profileExists: boolean;
  profile: ProfileProps;
  topupAmount: number;
  setTopupAmount: (to: number) => void;
  ethEncryptPublicKey: string;
  setShowOverlay: (to: boolean) => void;
  accountTypeSwitchValue: AccountTypes;
  setAccountTypeSwitchValue: (to: AccountTypes) => void;
  requires2Fa: boolean;
}

export interface TopupBalanceArgs {
  topupAmount: number;
  commitment: string;
  chainId: string;
  handleError: (msg: string) => void;
  currency: Currency;
  setShowOverlay: (to: boolean) => void;
}

export interface onCreateAccountSubmitArgs {
  chainId: string;
  handleError: CallableFunction;
  profileExists: boolean;
  profile: ProfileProps;
  selectedCurrency: Currency;
  depositAmount: string;
  passwordProps: AccountPasswordInputProps;
  ethEncryptPublicKey: string;
  accountCurrency: string;
  setShowOverlay: (to: boolean) => void;
  accountTypeSwitchValue: AccountTypes;
}

export interface LoggedInUiProps {
  item: ItemProps;
  accounts: any;
  selectedAccount: number;
  setSelectedAccount: (to: number) => void;
  paymentAmount: string;

  //# used for creating a new account

  newAccountPasswordProps: AccountPasswordInputProps;
  setNewAccountPasswordStrengthNotification: (to: string) => void;
  newAccountPasswordScore: number;
  setNewAccountPasswordScore: (to: number) => void;
  setNewAccountPasswordMatchError: (to: string) => void;
  profileExists: boolean;
  profile: ProfileProps;

  // used for the selected account!
  selectedAccountPassword: string;
  setSelectedAccountPassword: (to: string) => void;

  // used for topping up the account
  topupAmount: number;
  setTopupAmount: (to: number) => void;
  ethEncryptPublicKey: string;

  // Used for the carousel that displays the accounts!
  currentlyShowingAccount: number;
  visible: boolean;
  backClicked: () => void;
  forwardClicked: () => void;

  showOverlay: boolean;
  setShowOverlay: (to: boolean) => void;
  showOverlayError: ShowOverlayError;

  accountTypeSwitchValue: AccountTypes;
  setAccountTypeSwitchValue: (to: AccountTypes) => void;

  requires2Fa: boolean;
  url: string;
}
