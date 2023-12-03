import { query } from "../utils.ts";

export async function selectCurrentUserChallenge(
  ctx: any,
  args: {},
) {
  return await query<{}>(
    {
      ctx,
      args,
      impl: async (p) => {
        return await p.client.from("UserChallenges")
          .select()
          .eq("user_id", p.userid);
      },
      name: "selectCurrentUserChallenge",
    },
  );
}

export async function insertNewChallenge(
  ctx: any,
  args: { challenge: string; email: string },
) {
  return await query<{ challenge: string; email: string }>(
    {
      ctx,
      args,
      impl: async (p) => {
        return p.client.from("UserChallenges")
          .insert({
            created_at: new Date().toUTCString(),
            user_id: p.userid,
            currentChallenge: p.args.challenge,
            lastUpdated: new Date().toUTCString(),
            email: p.args.email,
          });
      },
      name: "insertNewChallenge",
    },
  );
}

export async function updateUserChallengeByUserId(
  ctx: any,
  args: { challenge: string },
) {
  return await query<{ challenge: string }>(
    {
      ctx,
      args,
      impl: async (p) => {
        return p.client.from("UserChallenges")
          .update({
            currentChallenge: args.challenge,
            lastUpdated: new Date().toUTCString(),
          }).eq("user_id", p.userid);
      },
      name: "updateUserChallengeByUserId",
    },
  );
}
