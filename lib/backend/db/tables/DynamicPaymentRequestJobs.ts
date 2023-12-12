import { DynamicPaymentRequestJobsStatus } from "../../../enums.ts";
import { query, responseHandler, unwrapContext } from "../utils.ts";

export async function lockDynamicPaymentRequestJobs(
  ctx: any,
) {
  const { client, userid } = unwrapContext(ctx);
  const res = await client.from("DynamicPaymentRequestJobs")
    .update({
      status: DynamicPaymentRequestJobsStatus.LOCKED,
      last_modified: new Date().toUTCString(),
    })
    .eq("status", DynamicPaymentRequestJobsStatus.CREATED)
    .lt("created_at", new Date().toUTCString());

  return responseHandler(res, {
    rpc: "lockDynamicPaymentRequestJobs",
    args: { userid },
  });
}

export async function selectDynamicPaymentRequestJobWhereStatusIsLocked(
  ctx: any,
) {
  return await query<{}>({
    ctx,
    args: {},
    impl: async (p) => {
      return await p.client.from("DynamicPaymentRequestJobs")
        .select(
          "*,paymentIntent_id(*,account_id(*),debit_item_id(*))",
        ).eq("status", DynamicPaymentRequestJobsStatus.LOCKED);
    },
    name: "selectDynamicPaymentRequestJobWhereStatusIsLocked",
  });
}

export async function updatDynamicPaymentRequestJobStatusTo(
  ctx: any,
  args: {
    status: DynamicPaymentRequestJobsStatus;
    id: number;
  },
) {
  return await query<{ status: DynamicPaymentRequestJobsStatus; id: number }>({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("DynamicPaymentRequestJobs")
        .update(
          {
            status: p.args.status,
            last_modified: new Date().toUTCString(),
          },
        ).eq("status", DynamicPaymentRequestJobsStatus.LOCKED)
        .eq("id", p.args.id);
    },
    name: "updatDynamicPaymentRequestJobStatusTo",
  });
}

export async function selectDynamicPaymentRequestJobByPaymentIntentId(
  ctx: any,
  args: {
    paymentIntentId: number;
    status: DynamicPaymentRequestJobsStatus;
  },
) {
  //This fetches the completed dynamic payment request job for the email/webhooks
  return await query<
    { paymentIntentId: number; status: DynamicPaymentRequestJobsStatus }
  >({
    ctx,
    args,
    impl: async (p) => {
      return await p.client.from("DynamicPaymentRequestJobs")
        .select("*").eq("paymentIntent_id", p.args.paymentIntentId).eq(
          "status",
          p.args.status,
        );
    },
    name: "selectDynamicPaymentRequestJobByPaymentIntentId",
  });
}
