import { HandlerContext } from "$fresh/server.ts";
import {
  DynamicPaymentRequestResponseBuilder,
  SinglePaymentIntentResponseBuilder,
  v1Error,
  v1Success,
} from "../../../../lib/api_v1/responseBuilders.ts";
import { DynamicPaymentRequestResponseMessage } from "../../../../lib/api_v1/types.ts";
import {
  addDynamicPaymentRequest,
  cancelDynamicPaymentRequestLogic,
} from "../../../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../../../lib/backend/db/queryBuilder.ts";
import { selectPaymentIntentByPaymentIntentAPIV1 } from "../../../../lib/backend/db/v1.ts";
import { State } from "../../../_middleware.ts";

export const handler = {
  async GET(_req: Request, ctx: HandlerContext<any, State>) {
    const { slug } = ctx.params;
    try {
      if (slug.length === 0) {
        throw new Error("Missing paymentIntent parameter");
      }
      const queryBuilder = new QueryBuilder(ctx);
      const select = queryBuilder.select();
      const paymentIntent = await selectPaymentIntentByPaymentIntentAPIV1(ctx, {
        paymentIntent: slug,
      });

      if (paymentIntent.data.length === 0) {
        throw new Error("Payment Intent not found");
      }

      const dynamicPaymentRequest = await select.DynamicPaymentRequestJobs
        .byPaymentIntentId(
          paymentIntent.data[0].id,
        );
      return v1Success(SinglePaymentIntentResponseBuilder(
        {
          returnError: false,
          error: {
            message: "",
            status: 0,
            timestamp: "",
          },
          paymentIntentRow: paymentIntent.data,
          dynamicPaymentRequestRow: dynamicPaymentRequest.data,
        },
      ));
    } catch (err: any) {
      return v1Error(
        SinglePaymentIntentResponseBuilder(
          {
            returnError: true,
            error: {
              message: err.message,
              status: 400,
              timestamp: new Date().toUTCString(),
            },
            paymentIntentRow: [],
            dynamicPaymentRequestRow: [],
          },
        ),
        400,
      );
    }
  },
  async POST(_req: Request, ctx: HandlerContext<any, State>) {
    const { slug } = ctx.params;
    const json = await _req.json();
    const cancel_request = json.cancel_request;
    const request_id = json.id;
    const requested_debit_amount = json.requested_debit_amount;
    try {
      if (slug.length === 0) {
        throw new Error("Missing paymentIntent parameter");
      }
      const queryBuilder = new QueryBuilder(ctx);

      if (cancel_request) {
        await cancelDynamicPaymentRequestLogic(
          request_id,
          queryBuilder,
        );
        return v1Success(
          DynamicPaymentRequestResponseBuilder({
            returnError: false,
            error: {
              message: "",
              status: 0,
              timestamp: "",
            },
            result: {
              message: DynamicPaymentRequestResponseMessage.CANCELLEDREQUEST,
              id: request_id,
            },
            payment_intent: slug,
          }),
        );
      } else {
        const added = await addDynamicPaymentRequest(
          slug,
          queryBuilder,
          requested_debit_amount,
        );

        return v1Success(
          DynamicPaymentRequestResponseBuilder({
            returnError: false,
            error: {
              message: "",
              status: 0,
              timestamp: "",
            },
            result: {
              message: DynamicPaymentRequestResponseMessage.CREATEDREQUEST,
              id: added.id,
            },
            payment_intent: slug,
          }),
        );
      }
    } catch (err) {
      return v1Error(
        DynamicPaymentRequestResponseBuilder({
          returnError: true,
          error: {
            message: err.message,
            status: 400,
            timestamp: new Date().toUTCString(),
          },
          result: {
            message: DynamicPaymentRequestResponseMessage.CREATEDREQUEST,
            id: 0,
          },
          payment_intent: slug,
        }),
        400,
      );
    }
  },
};
