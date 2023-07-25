import { Handlers } from "$fresh/server.ts";
import { State } from "../_middleware.ts";


export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {
        const json = await _req.json();
        const walletaddress = json.walletaddress;
        const firstname = json.firstname;
        const lastname = json.lastname;
        const addressline1 = json.addressline1;
        const addressline2 = json.addressline2;
        const city = json.city;
        const postcode = json.postcode;
        const country = json.country;

        const { data: profileData, error: profileError } = await ctx.state.supabaseClient.from("Profiles").select().eq("userid", ctx.state.userid);

        if (profileData === null || profileData.length === 0) {
            // Do the insert here
            const { error } = await ctx.state.supabaseClient.from("Profiles").insert({
                userid: ctx.state.userid,
                walletaddress,
                firstname,
                lastname,
                addressline1,
                addressline2,
                city,
                postcode,
                country
            })
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