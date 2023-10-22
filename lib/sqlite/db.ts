import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";
import { SQLiteClient } from "./types.ts";
import { from, getUser, signInWithPassword, signUp } from "./Mappings.ts";

const DBName = "service.db";

function openDb() {
  return new Database(DBName);
}

const db = openDb();
console.log("this runs once");

export function closeDb(db: Database) {
  db.close();
}

export function createSQLiteClient(): SQLiteClient {
  console.log("creating a client");

  return {
    //TODO: Maybe I keep the supabas client for the authentication for now?
    auth: {
      signUp,
      signInWithPassword,
      getUser,
    },
    from,
  };
}

const liteClient = createSQLiteClient();
liteClient;
