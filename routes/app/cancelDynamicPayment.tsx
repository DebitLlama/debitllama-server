import { Handlers } from "$fresh/server.ts";
import { getRelayerBalanceForChainId, updateRelayerBalanceWithAllocatedAmount } from "../../lib/backend/businessLogic.ts";
import QueryBuilder from "../../lib/backend/queryBuilder.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import { ChainIds } from "../../lib/shared/web3.ts";
import { State } from "../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const dynamicPaymentRequestId = json.dynamicPaymentRequestId;
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        const deleteQ = queryBuilder.delete();

        const { data: selectedDynamicPaymentRequest } = await select.DynamicPaymentRequestJobs.byJobId(dynamicPaymentRequestId);

        // this will delete the row by id if it was created by the user and the row is not locked!
        const result = await deleteQ.DynamicPaymentRequestJobs.byIdForRequestCreator(
            dynamicPaymentRequestId
        )
        const chainId = selectedDynamicPaymentRequest[0].paymentIntent_id.network as ChainIds;
        const relayerBalance = selectedDynamicPaymentRequest[0].relayerBalance_id;
        const allocatedGas = selectedDynamicPaymentRequest[0].allocatedGas;
        await updateRelayerBalanceWithAllocatedAmount(
            queryBuilder,
            relayerBalance.id,
            chainId,
            getRelayerBalanceForChainId(chainId, relayerBalance),
            allocatedGas,
            "0"
        )

        if (result.error !== null) {
            return errorResponseBuilder("Unable to delete Payment Request!")
        } else {
            return successResponseBuilder("Deleted Payment Request! The page will refresh in 10 seconds!")
        }
    }
}