import { Handlers } from "$fresh/server.ts";
import { errorResponseBuilder, successResponseBuilder } from "../../lib/backend/responseBuilders.ts";
import { deleteDynamicPaymentRequestJobById, selectDynamicPaymentRequestJobById, updateRelayerBalanceWithAllocatedAmount } from "../../lib/backend/supabaseQueries.ts";
import { getRelayerBalanceForChainId } from "../../lib/backend/web3.ts";
import { ChainIds } from "../../lib/shared/web3.ts";
import { State } from "../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const dynamicPaymentRequestId = json.dynamicPaymentRequestId;

        const { data: selectedDynamicPaymentRequest, error: selectedDynamicErr } = await selectDynamicPaymentRequestJobById(
            ctx.state.supabaseClient, dynamicPaymentRequestId)

        // this will delete the row by id if it was created by the user and the row is not locked!
        const result = await deleteDynamicPaymentRequestJobById(
            ctx.state.supabaseClient,
            dynamicPaymentRequestId,
            ctx.state.userid
        )
        const chainId = selectedDynamicPaymentRequest[0].paymentIntent_id.network as ChainIds;
        const relayerBalance = selectedDynamicPaymentRequest[0].relayerBalance_id;
        const allocatedGas = selectedDynamicPaymentRequest[0].allocatedGas;
        const res = await updateRelayerBalanceWithAllocatedAmount(
            ctx.state.supabaseClient,
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