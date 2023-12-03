import { Handlers } from "$fresh/server.ts";
import { updateItemEmailNotifications } from "../../../lib/backend/db/tables/Items.ts";
import { State } from "../../_middleware.ts";

// Update the item email_notifications by button_id for the creator!

export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const headers = new Headers();
        const form = await _req.formData();
        const button_id = form.get("button_id") as string;
        const email_notifications = form.get("email_notifications") as string;
        // // I update by email_notifications and button id and then return a redirect!
        // // If the logged in user_id don't have the button_id, the update fails
        // // But I still just return ar edirect as nothing happens.
        await updateItemEmailNotifications(ctx, { button_id, email_notifications: email_notifications !== "true" });
        headers.set("location", `/app/item?q=${button_id}`);
        return new Response(null, { status: 303, headers })

    },
};
