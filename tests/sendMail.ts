import { sendMail, SendMailArgs } from "../lib/email/mailer.ts";
import "$std/dotenv/load.ts";

async function sendMailTest() {
  const Dargs = Deno.args;

  const args: SendMailArgs = {
    from: Dargs[0],
    to: Dargs[1],
    subject: Dargs[2],
    content: Dargs[3],
    html: `<p>${Dargs[3]}</p>`,
  };
  console.log(Deno.args);
  await sendMail(args);
}

await sendMailTest();

//Run it like deno run /tests/sendMail.ts <from> <to> <subject> <message>
