// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $SignupSuccess from "./routes/SignupSuccess.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_relayer_balance from "./routes/api/relayer/balance.ts";
import * as $api_relayer_dynamicjobstatus from "./routes/api/relayer/dynamicjobstatus.ts";
import * as $api_relayer_dynamicpayments from "./routes/api/relayer/dynamicpayments.ts";
import * as $api_relayer_fixedpayments from "./routes/api/relayer/fixedpayments.ts";
import * as $api_relayer_lock from "./routes/api/relayer/lock.ts";
import * as $api_relayer_relayingfailed from "./routes/api/relayer/relayingfailed.ts";
import * as $api_relayer_relayingsuccess from "./routes/api/relayer/relayingsuccess.ts";
import * as $api_v1_middleware from "./routes/api/v1/_middleware.ts";
import * as $api_v1_accounts_slug_ from "./routes/api/v1/accounts/[slug].ts";
import * as $api_v1_accounts_index from "./routes/api/v1/accounts/index.ts";
import * as $api_v1_index from "./routes/api/v1/index.ts";
import * as $api_v1_items_slug_ from "./routes/api/v1/items/[slug].ts";
import * as $api_v1_items_index from "./routes/api/v1/items/index.ts";
import * as $api_v1_payment_intents_slug_ from "./routes/api/v1/payment_intents/[slug].ts";
import * as $api_v1_payment_intents_index from "./routes/api/v1/payment_intents/index.ts";
import * as $api_v1_zapier_index from "./routes/api/v1/zapier/index.ts";
import * as $app_middleware from "./routes/app/_middleware.ts";
import * as $app_account from "./routes/app/account.tsx";
import * as $app_accounts from "./routes/app/accounts.tsx";
import * as $app_addNewAccount from "./routes/app/addNewAccount.tsx";
import * as $app_addNewDebitItem from "./routes/app/addNewDebitItem.tsx";
import * as $app_approvepayment from "./routes/app/approvepayment.tsx";
import * as $app_createdPaymentIntents from "./routes/app/createdPaymentIntents.tsx";
import * as $app_debitItems from "./routes/app/debitItems.tsx";
import * as $app_feedback from "./routes/app/feedback.tsx";
import * as $app_inactiveAccounts from "./routes/app/inactiveAccounts.tsx";
import * as $app_item from "./routes/app/item.tsx";
import * as $app_manage_api_rest from "./routes/app/manage_api/rest.tsx";
import * as $app_manage_api_webhooks from "./routes/app/manage_api/webhooks.tsx";
import * as $app_newConnectedWallet from "./routes/app/newConnectedWallet.tsx";
import * as $app_pagination_accessTokens from "./routes/app/pagination/accessTokens.tsx";
import * as $app_pagination_accountPaymentIntents from "./routes/app/pagination/accountPaymentIntents.tsx";
import * as $app_pagination_debitItems from "./routes/app/pagination/debitItems.tsx";
import * as $app_pagination_debitItemsPaymentIntents from "./routes/app/pagination/debitItemsPaymentIntents.tsx";
import * as $app_pagination_itemPaymentIntents from "./routes/app/pagination/itemPaymentIntents.tsx";
import * as $app_pagination_relayerTxHistory from "./routes/app/pagination/relayerTxHistory.tsx";
import * as $app_pagination_relayerTxHistoryWithPaymentIntentId from "./routes/app/pagination/relayerTxHistoryWithPaymentIntentId.tsx";
import * as $app_pagination_subscriptions from "./routes/app/pagination/subscriptions.tsx";
import * as $app_payeePaymentIntents from "./routes/app/payeePaymentIntents.tsx";
import * as $app_paymentIntents from "./routes/app/paymentIntents.tsx";
import * as $app_post_addEmailNotifications from "./routes/app/post/addEmailNotifications.tsx";
import * as $app_post_cancelDynamicPayment from "./routes/app/post/cancelDynamicPayment.tsx";
import * as $app_post_checkoutprofiledata from "./routes/app/post/checkoutprofiledata.tsx";
import * as $app_post_refreshbalance from "./routes/app/post/refreshbalance.tsx";
import * as $app_post_saveAccountAPI from "./routes/app/post/saveAccountAPI.ts";
import * as $app_post_savePaymentIntent from "./routes/app/post/savePaymentIntent.ts";
import * as $app_post_updateItemUrl from "./routes/app/post/updateItemUrl.tsx";
import * as $app_profile from "./routes/app/profile.tsx";
import * as $app_subscriptions from "./routes/app/subscriptions.tsx";
import * as $app_updatepassword from "./routes/app/updatepassword.tsx";
import * as $app_webauthn_2fa from "./routes/app/webauthn/2fa.tsx";
import * as $app_webauthn_accountRegister from "./routes/app/webauthn/accountRegister.ts";
import * as $app_webauthn_accounts from "./routes/app/webauthn/accounts.tsx";
import * as $app_webauthn_register from "./routes/app/webauthn/register.ts";
import * as $app_webauthn_revoke from "./routes/app/webauthn/revoke.ts";
import * as $app_webauthn_verify from "./routes/app/webauthn/verify.ts";
import * as $buyitnow from "./routes/buyitnow.tsx";
import * as $buyitnowlogout from "./routes/buyitnowlogout.tsx";
import * as $emailVerified from "./routes/emailVerified.tsx";
import * as $index from "./routes/index.tsx";
import * as $landingpage_components from "./routes/landingpage/components.tsx";
import * as $login from "./routes/login.tsx";
import * as $logout from "./routes/logout.tsx";
import * as $privacyPolicy from "./routes/privacyPolicy.tsx";
import * as $ramp from "./routes/ramp.tsx";
import * as $requestpasswordreset from "./routes/requestpasswordreset.tsx";
import * as $resendConfirmation from "./routes/resendConfirmation.tsx";
import * as $signup from "./routes/signup.tsx";
import * as $termsAndConditions from "./routes/termsAndConditions.tsx";
import * as $AccountTopupOrClose from "./islands/AccountTopupOrClose.tsx";
import * as $AddNew2FAPasskeyButton from "./islands/AddNew2FAPasskeyButton.tsx";
import * as $AddNewAccountPasskeyButton from "./islands/AddNewAccountPasskeyButton.tsx";
import * as $CancelDynamicPaymentRequestButton from "./islands/CancelDynamicPaymentRequestButton.tsx";
import * as $CancelPaymentIntentButton from "./islands/CancelPaymentIntentButton.tsx";
import * as $CurrencySelectDropdown from "./islands/CurrencySelectDropdown.tsx";
import * as $DebitItemTableRow from "./islands/DebitItemTableRow.tsx";
import * as $TriggerDirectDebitButton from "./islands/TriggerDirectDebitButton.tsx";
import * as $WalletApproveOrDisconnect from "./islands/WalletApproveOrDisconnect.tsx";
import * as $WalletBalanceDisplay from "./islands/WalletBalanceDisplay.tsx";
import * as $WalletDetailsFetcher from "./islands/WalletDetailsFetcher.tsx";
import * as $WebhooksUI from "./islands/WebhooksUI.tsx";
import * as $accountCardCarousel from "./islands/accountCardCarousel.tsx";
import * as $accountCreatePageForm from "./islands/accountCreatePageForm.tsx";
import * as $accountPasswordInput from "./islands/accountPasswordInput.tsx";
import * as $addNewDebitItemPageForm from "./islands/addNewDebitItemPageForm.tsx";
import * as $approvePaymentIsland from "./islands/approvePaymentIsland.tsx";
import * as $checkout_NextBttnUi from "./islands/checkout/NextBttnUi.tsx";
import * as $checkout_buyButtonPage from "./islands/checkout/buyButtonPage.tsx";
import * as $connectWalletPageForm from "./islands/connectWalletPageForm.tsx";
import * as $landingpage_changingTitle from "./islands/landingpage/changingTitle.tsx";
import * as $landingpage_contactUsForm from "./islands/landingpage/contactUsForm.tsx";
import * as $pagination_AccessTokensTable from "./islands/pagination/AccessTokensTable.tsx";
import * as $pagination_DebitItemsTable from "./islands/pagination/DebitItemsTable.tsx";
import * as $pagination_PaymentIntentsPaginationForAccounts from "./islands/pagination/PaymentIntentsPaginationForAccounts.tsx";
import * as $pagination_PaymentIntentsPaginationForAll from "./islands/pagination/PaymentIntentsPaginationForAll.tsx";
import * as $pagination_PaymentIntentsPaginationForDebitItemsPage from "./islands/pagination/PaymentIntentsPaginationForDebitItemsPage.tsx";
import * as $pagination_PaymentIntentsPaginationForItemPage from "./islands/pagination/PaymentIntentsPaginationForItemPage.tsx";
import * as $pagination_RelayedTxHistoryWithPagination from "./islands/pagination/RelayedTxHistoryWithPagination.tsx";
import * as $routes_Sidebar from "./islands/routes/Sidebar.tsx";
import * as $utils_AccountAccessToggle from "./islands/utils/AccountAccessToggle.tsx";
import * as $utils_AccountDisplayElement from "./islands/utils/AccountDisplayElement.tsx";
import * as $utils_AccountsSelectButtons from "./islands/utils/AccountsSelectButtons.tsx";
import * as $utils_CookieBanner from "./islands/utils/CookieBanner.tsx";
import * as $utils_ShowAndContent from "./islands/utils/ShowAndContent.tsx";
import * as $utils_SidebarToggleButton from "./islands/utils/SidebarToggleButton.tsx";
import * as $utils_TestnetTokens from "./islands/utils/TestnetTokens.tsx";
import * as $utils_WalletAddressSelector from "./islands/utils/WalletAddressSelector.tsx";
import * as $utils_copyButton from "./islands/utils/copyButton.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/SignupSuccess.tsx": $SignupSuccess,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/relayer/balance.ts": $api_relayer_balance,
    "./routes/api/relayer/dynamicjobstatus.ts": $api_relayer_dynamicjobstatus,
    "./routes/api/relayer/dynamicpayments.ts": $api_relayer_dynamicpayments,
    "./routes/api/relayer/fixedpayments.ts": $api_relayer_fixedpayments,
    "./routes/api/relayer/lock.ts": $api_relayer_lock,
    "./routes/api/relayer/relayingfailed.ts": $api_relayer_relayingfailed,
    "./routes/api/relayer/relayingsuccess.ts": $api_relayer_relayingsuccess,
    "./routes/api/v1/_middleware.ts": $api_v1_middleware,
    "./routes/api/v1/accounts/[slug].ts": $api_v1_accounts_slug_,
    "./routes/api/v1/accounts/index.ts": $api_v1_accounts_index,
    "./routes/api/v1/index.ts": $api_v1_index,
    "./routes/api/v1/items/[slug].ts": $api_v1_items_slug_,
    "./routes/api/v1/items/index.ts": $api_v1_items_index,
    "./routes/api/v1/payment_intents/[slug].ts": $api_v1_payment_intents_slug_,
    "./routes/api/v1/payment_intents/index.ts": $api_v1_payment_intents_index,
    "./routes/api/v1/zapier/index.ts": $api_v1_zapier_index,
    "./routes/app/_middleware.ts": $app_middleware,
    "./routes/app/account.tsx": $app_account,
    "./routes/app/accounts.tsx": $app_accounts,
    "./routes/app/addNewAccount.tsx": $app_addNewAccount,
    "./routes/app/addNewDebitItem.tsx": $app_addNewDebitItem,
    "./routes/app/approvepayment.tsx": $app_approvepayment,
    "./routes/app/createdPaymentIntents.tsx": $app_createdPaymentIntents,
    "./routes/app/debitItems.tsx": $app_debitItems,
    "./routes/app/feedback.tsx": $app_feedback,
    "./routes/app/inactiveAccounts.tsx": $app_inactiveAccounts,
    "./routes/app/item.tsx": $app_item,
    "./routes/app/manage_api/rest.tsx": $app_manage_api_rest,
    "./routes/app/manage_api/webhooks.tsx": $app_manage_api_webhooks,
    "./routes/app/newConnectedWallet.tsx": $app_newConnectedWallet,
    "./routes/app/pagination/accessTokens.tsx": $app_pagination_accessTokens,
    "./routes/app/pagination/accountPaymentIntents.tsx":
      $app_pagination_accountPaymentIntents,
    "./routes/app/pagination/debitItems.tsx": $app_pagination_debitItems,
    "./routes/app/pagination/debitItemsPaymentIntents.tsx":
      $app_pagination_debitItemsPaymentIntents,
    "./routes/app/pagination/itemPaymentIntents.tsx":
      $app_pagination_itemPaymentIntents,
    "./routes/app/pagination/relayerTxHistory.tsx":
      $app_pagination_relayerTxHistory,
    "./routes/app/pagination/relayerTxHistoryWithPaymentIntentId.tsx":
      $app_pagination_relayerTxHistoryWithPaymentIntentId,
    "./routes/app/pagination/subscriptions.tsx": $app_pagination_subscriptions,
    "./routes/app/payeePaymentIntents.tsx": $app_payeePaymentIntents,
    "./routes/app/paymentIntents.tsx": $app_paymentIntents,
    "./routes/app/post/addEmailNotifications.tsx":
      $app_post_addEmailNotifications,
    "./routes/app/post/cancelDynamicPayment.tsx":
      $app_post_cancelDynamicPayment,
    "./routes/app/post/checkoutprofiledata.tsx": $app_post_checkoutprofiledata,
    "./routes/app/post/refreshbalance.tsx": $app_post_refreshbalance,
    "./routes/app/post/saveAccountAPI.ts": $app_post_saveAccountAPI,
    "./routes/app/post/savePaymentIntent.ts": $app_post_savePaymentIntent,
    "./routes/app/post/updateItemUrl.tsx": $app_post_updateItemUrl,
    "./routes/app/profile.tsx": $app_profile,
    "./routes/app/subscriptions.tsx": $app_subscriptions,
    "./routes/app/updatepassword.tsx": $app_updatepassword,
    "./routes/app/webauthn/2fa.tsx": $app_webauthn_2fa,
    "./routes/app/webauthn/accountRegister.ts": $app_webauthn_accountRegister,
    "./routes/app/webauthn/accounts.tsx": $app_webauthn_accounts,
    "./routes/app/webauthn/register.ts": $app_webauthn_register,
    "./routes/app/webauthn/revoke.ts": $app_webauthn_revoke,
    "./routes/app/webauthn/verify.ts": $app_webauthn_verify,
    "./routes/buyitnow.tsx": $buyitnow,
    "./routes/buyitnowlogout.tsx": $buyitnowlogout,
    "./routes/emailVerified.tsx": $emailVerified,
    "./routes/index.tsx": $index,
    "./routes/landingpage/components.tsx": $landingpage_components,
    "./routes/login.tsx": $login,
    "./routes/logout.tsx": $logout,
    "./routes/privacyPolicy.tsx": $privacyPolicy,
    "./routes/ramp.tsx": $ramp,
    "./routes/requestpasswordreset.tsx": $requestpasswordreset,
    "./routes/resendConfirmation.tsx": $resendConfirmation,
    "./routes/signup.tsx": $signup,
    "./routes/termsAndConditions.tsx": $termsAndConditions,
  },
  islands: {
    "./islands/AccountTopupOrClose.tsx": $AccountTopupOrClose,
    "./islands/AddNew2FAPasskeyButton.tsx": $AddNew2FAPasskeyButton,
    "./islands/AddNewAccountPasskeyButton.tsx": $AddNewAccountPasskeyButton,
    "./islands/CancelDynamicPaymentRequestButton.tsx":
      $CancelDynamicPaymentRequestButton,
    "./islands/CancelPaymentIntentButton.tsx": $CancelPaymentIntentButton,
    "./islands/CurrencySelectDropdown.tsx": $CurrencySelectDropdown,
    "./islands/DebitItemTableRow.tsx": $DebitItemTableRow,
    "./islands/TriggerDirectDebitButton.tsx": $TriggerDirectDebitButton,
    "./islands/WalletApproveOrDisconnect.tsx": $WalletApproveOrDisconnect,
    "./islands/WalletBalanceDisplay.tsx": $WalletBalanceDisplay,
    "./islands/WalletDetailsFetcher.tsx": $WalletDetailsFetcher,
    "./islands/WebhooksUI.tsx": $WebhooksUI,
    "./islands/accountCardCarousel.tsx": $accountCardCarousel,
    "./islands/accountCreatePageForm.tsx": $accountCreatePageForm,
    "./islands/accountPasswordInput.tsx": $accountPasswordInput,
    "./islands/addNewDebitItemPageForm.tsx": $addNewDebitItemPageForm,
    "./islands/approvePaymentIsland.tsx": $approvePaymentIsland,
    "./islands/checkout/NextBttnUi.tsx": $checkout_NextBttnUi,
    "./islands/checkout/buyButtonPage.tsx": $checkout_buyButtonPage,
    "./islands/connectWalletPageForm.tsx": $connectWalletPageForm,
    "./islands/landingpage/changingTitle.tsx": $landingpage_changingTitle,
    "./islands/landingpage/contactUsForm.tsx": $landingpage_contactUsForm,
    "./islands/pagination/AccessTokensTable.tsx": $pagination_AccessTokensTable,
    "./islands/pagination/DebitItemsTable.tsx": $pagination_DebitItemsTable,
    "./islands/pagination/PaymentIntentsPaginationForAccounts.tsx":
      $pagination_PaymentIntentsPaginationForAccounts,
    "./islands/pagination/PaymentIntentsPaginationForAll.tsx":
      $pagination_PaymentIntentsPaginationForAll,
    "./islands/pagination/PaymentIntentsPaginationForDebitItemsPage.tsx":
      $pagination_PaymentIntentsPaginationForDebitItemsPage,
    "./islands/pagination/PaymentIntentsPaginationForItemPage.tsx":
      $pagination_PaymentIntentsPaginationForItemPage,
    "./islands/pagination/RelayedTxHistoryWithPagination.tsx":
      $pagination_RelayedTxHistoryWithPagination,
    "./islands/routes/Sidebar.tsx": $routes_Sidebar,
    "./islands/utils/AccountAccessToggle.tsx": $utils_AccountAccessToggle,
    "./islands/utils/AccountDisplayElement.tsx": $utils_AccountDisplayElement,
    "./islands/utils/AccountsSelectButtons.tsx": $utils_AccountsSelectButtons,
    "./islands/utils/CookieBanner.tsx": $utils_CookieBanner,
    "./islands/utils/ShowAndContent.tsx": $utils_ShowAndContent,
    "./islands/utils/SidebarToggleButton.tsx": $utils_SidebarToggleButton,
    "./islands/utils/TestnetTokens.tsx": $utils_TestnetTokens,
    "./islands/utils/WalletAddressSelector.tsx": $utils_WalletAddressSelector,
    "./islands/utils/copyButton.tsx": $utils_copyButton,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
