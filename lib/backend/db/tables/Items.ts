import { PaginationArgs, PaginationArgsWithSearch, SupabaseQueryResult } from "../utils.ts";
import { query, responseHandler, unwrapContext } from "../utils.ts";

export async function updateItemEmailNotifications(
  ctx: any,
  args: {
    button_id: string;
    email_notifications: boolean;
  },
) {
  const { client, userid } = unwrapContext(ctx);

  const res = await client.from("Items").update({
    email_notifications: args.email_notifications,
  }).eq("button_id", args.button_id)
    .eq("payee_id", userid);

  return responseHandler(res, {
    rpc: "updateItemEmailNotifications",
    args: { ...args, userid },
  });
}

export async function updateItemRedirectUrl(
  ctx: any,
  args: {
    redirect_url: string;
    button_id: string;
  },
) {
  const { client, userid } = unwrapContext(ctx);

  const res = await client.from("Items").update({
    redirect_url: args.redirect_url,
  }).eq("button_id", args.button_id)
    .eq("payee_id", userid);

  return responseHandler(res, {
    rpc: "updateItemEmailNotifications",
    args: { ...args, userid },
  });
}

export async function selectItemsbyUserIdForPayeePaginated(
  ctx: any,
  args: PaginationArgs,
) {
  return await query<PaginationArgs>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("Items")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .eq("payee_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "SelectItemsbyUserIdForPayeePaginated",
    },
  );
}

export async function selectItemsbyUserIdForPayeePaginatedWithSearchName(
  ctx: any,
  args: PaginationArgsWithSearch,
) {
  return await query<PaginationArgsWithSearch>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("Items")
          .select("*", { count: "exact" })
          .order(p.args.order, { ascending: p.args.ascending })
          .textSearch("name", p.args.searchTerm)
          .eq("payee_id", p.userid)
          .range(p.args.rangeFrom, p.args.rangeTo);
      },
      name: "selectItemsbyUserIdForPayeePaginatedWithSearchName",
    },
  );
}

//TODO: Refactor this to individual functions!
//TODO: Break up query builder like this and refactor all to individual functions
// export default class ItemsQueryBuilder {
//   client: any;
//   userid: any;

//   constructor(ctx: { state: { supabaseClient: any; userid: string | null } }) {
//     this.client = ctx.state.supabaseClient;
//     this.userid = ctx.state.userid;
//   }

//   select() {
//     return {
//       Items: {
//         //selectItemByButtonId
//         byButtonId: async (buttonId: string) => {
//           const res = await this.client.from("Items").select(
//             "*,relayerBalance_id(*)",
//           ).eq(
//             "button_id",
//             buttonId,
//           );
//           return this.responseHandler(res);
//         },
//         byButtonIdForPayeeOnly: async (buttonId: string) => {
//           const res = await this.client.from("Items").select(
//             "*,relayerBalance_id(*)",
//           ).eq(
//             "button_id",
//             buttonId,
//           ).eq("payee_id", this.userid);
//           return this.responseHandler(res);
//         },
//         //selectItemsByPayeeIdDesc
//         byUserIdForPayeeDesc: async () => {
//           const res = await this.client.from("Items").select().eq(
//             "payee_id",
//             this.userid,
//           )
//             .order("created_at", { ascending: false });
//           return this.responseHandler(res);
//         },
//       },
//     };
//   }

//   insert() {
//     return {
//       Items: {
//         //insertNewItem
//         newItem: async (
//           payee_address: string,
//           currency: string,
//           max_price: string,
//           debit_times: string,
//           debit_interval: string,
//           redirect_url: string,
//           pricing: string,
//           network: string,
//           name: string,
//           relayerBalance_id: string,
//         ) => {
//           const res = await this.client.from("Items").insert({
//             created_at: new Date().toUTCString(),
//             payee_id: this.userid,
//             payee_address,
//             currency,
//             max_price,
//             debit_times,
//             debit_interval,
//             redirect_url,
//             pricing,
//             network,
//             name,
//             relayerBalance_id,
//           }).select();
//           return this.responseHandler(res);
//         },
//       },
//     };
//   }

//   update() {
//     return {
//       Items: {
//         //updateItem
//         deletedByButtonIdForPayee: async (
//           deleted: boolean,
//           button_id: string,
//         ) => {
//           const res = await this.client.from("Items")
//             .update({ deleted }).eq("payee_id", this.userid).eq(
//               "button_id",
//               button_id,
//             );
//           return this.responseHandler(res);
//         },
//         //updateItemPaymentIntentsCount
//         paymentIntentsCountByButtonId: async (
//           payment_intents_count: number,
//           button_id: string,
//         ) => {
//           const res = await this.client.from("Items").update({
//             payment_intents_count,
//           }).eq("button_id", button_id);

//           return this.responseHandler(res);
//         },
//       },
//     };
//   }


//   responseHandler(res: SupabaseQueryResult) {
//     if (res.error !== null) {
//       console.log("QUERY ERROR!");
//       console.log(res);
//       console.log(res.error);
//     }
//     return { ...res };
//   }
// }
