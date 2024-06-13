import { HandlerContext } from "$fresh/server.ts";
import { updateAccountBalanceByCommitment } from "../../../lib/backend/db/tables/Accounts.ts";
import { updatePaymentIntentStatusAfterSuccess } from "../../../lib/backend/db/tables/PaymentIntents.ts";
import { insertNewTx } from "../../../lib/backend/db/tables/RelayerHistory.ts";
import { EventType } from "../../../lib/backend/email/types.ts";
import { enqueueWebhookWork } from "../../../lib/backend/queue/kv.ts";
import { PaymentIntentStatus } from "../../../lib/enums.ts";
import { ChainIds } from "../../../lib/shared/web3.ts";

export interface RelayingSuccessArgs {
  chainId: ChainIds;
  payee_user_id: string;
  paymentIntentId: number;
  submittedTransaction: string;
  allGasUsed: string;
  paymentAmount: string;
  currency: string;
  commitment: string;
  newAccountBalance: string;
  statusText: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  used_for: number;
  paymentIntent: string;
}

export const handler = {
  async POST(_req: Request, ctx: HandlerContext) {
    const json = await _req.json();

    const {
      chainId,
      payee_user_id,
      paymentIntentId,
      submittedTransaction,
      allGasUsed,
      paymentAmount,
      currency,
      commitment,
      newAccountBalance,
      statusText,
      lastPaymentDate,
      nextPaymentDate,
      used_for,
      paymentIntent,
    } = json as RelayingSuccessArgs;

    if (ctx.state.userid !== payee_user_id) {
      return new Response(
        "payee_user_id must match the API token holder's user id",
        { status: 400 },
      );
    }

    await insertNewTx(ctx, {
      payee_user_id,
      paymentIntentId,
      submittedTransaction,
      allGasUsed,
      paymentAmount,
      paymentCurrency: currency,
      network: chainId,
    });

    await updateAccountBalanceByCommitment(ctx, {
      newAccountBalance,
      commitment,
    });

    await updatePaymentIntentStatusAfterSuccess(ctx, {
      statusText,
      lastPaymentDate,
      nextPaymentDate,
      used_for,
      paymentIntentRowId: paymentIntentId,
    });

    enqueueWebhookWork({
      eventType: statusText === PaymentIntentStatus.PAID
        ? EventType.SubscriptionEnded
        : EventType.Payment,
      paymentIntent,
    });
    return new Response(null, { status: 200 });
  },
};
