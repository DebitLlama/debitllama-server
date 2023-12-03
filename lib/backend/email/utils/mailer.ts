import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export interface SendMailArgs {
  from: string;
  to: string;
  subject: string;
  content: string;
  html: string;
}

export async function sendMail(args: SendMailArgs) {
  const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME") || "";
  const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME") || "";
  const SMTP_PASS = Deno.env.get("SMTP_PASSWORD") || "";

  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOSTNAME,
      port: 465,
      tls: true,
      auth: {
        username: SMTP_USERNAME,
        password: SMTP_PASS,
      },
    },
  });

  await client.send({ ...args });

  await client.close();
}
