import { kv } from "./queue/kv.ts";

const contactFormRateLimitInMillis = 1000 * 60 * 10; //10 minutes for the contact me form

//Checks if the single request is rate limited, does not buffer requests, checks a request interval instead
export async function single_is_rateLimited(
  remoteAddr: string,
  rateLimitFor: "contactForm" | string,
) {
  const now = Date.now();

  const entry = await kv.get(["ratelimiter", rateLimitFor, remoteAddr]);
  await kv.set(["ratelimiter", rateLimitFor, remoteAddr], {
    lastRequest: now,
  });

  if (!entry.value) {
    //Entry doesn't exist. It's not rate limited

    return false;
  }

  const { lastRequest } = entry.value as { lastRequest: number };

  switch (rateLimitFor) {
    case "contactForm":
      //If the last request plus the time limit is bigger than now, then we are still in rate limit
      return (lastRequest + contactFormRateLimitInMillis) > now;
    default:
      //Not implemented, just returns rate limited true
      return true;
  }
}
