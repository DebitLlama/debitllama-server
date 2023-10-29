import { Handlers } from "$fresh/server.ts";
import QueryBuilder from "../../../lib/backend/db/queryBuilder.ts";
import { State } from "../../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const firstname = json.firstname;
        const lastname = json.lastname;
        const addressline1 = json.addressline1;
        const addressline2 = json.addressline2;
        const city = json.city;
        const postcode = json.postcode;
        const country = json.country;
        const queryBuilder = new QueryBuilder(ctx);
        const select = queryBuilder.select();
        // TODO: THis could be jsut 1 RPC call: SELECT AND INSERT!
        const { data: profileData } = await select.Profiles.byUserId();

        if (profileData === null || profileData.length === 0) {
            const insert = queryBuilder.insert();
            // If profile don't exist I insert a new one!
            const { error } = await insert.Profiles.newProfile(
                firstname,
                lastname,
                addressline1,
                addressline2,
                city,
                postcode,
                country
            );
            if (error) {
                return new Response(null, { status: 500 })
            }
            return new Response(null, { status: 200 })
        } else {
            // Returns 500 because the row exists already, should not call this 
            return new Response(null, { status: 500 })
        }
    }
}