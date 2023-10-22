import {
  FromTableNames,
  GetUserFun,
  SignInWithPasswordFun,
  SignUpFun,
  SQLiteQueryResult,
  User,
  UserData,
} from "./types.ts";

export const signUp: SignUpFun = (email: string, password: string) => {
  // Mock the results for now
  const user = {
    id: "",
    aud: "",
    role: "",
    email: "",
    email_confirmed_at: "",
    phone: "",
    confirmed_at: "",
    last_sign_in_at: "",
    app_metadata: { provider: "", providers: [""] },
    user_metadata: {},
    identities: [],
    created_at: "",
    updated_at: "",
  };
  const result: SQLiteQueryResult<UserData> = {
    error: null,
    data: {
      user,
      session: {
        access_token: "",
        token_type: "bearer",
        expires_in: 0,
        expires_at: 0,
        refresh_token: 0,
        user,
      },
    },
    count: 0,
    status: 0,
    statusText: "",
  };

  return result;
};

export const signInWithPassword: SignInWithPasswordFun = (
  email: string,
  password: string,
) => {
  const user = {
    id: "",
    aud: "",
    role: "",
    email: "",
    email_confirmed_at: "",
    phone: "",
    confirmed_at: "",
    last_sign_in_at: "",
    app_metadata: { provider: "", providers: [""] },
    user_metadata: {},
    identities: [],
    created_at: "",
    updated_at: "",
  };
  const result: SQLiteQueryResult<UserData> = {
    error: null,
    data: {
      user,
      session: {
        access_token: "",
        token_type: "bearer",
        expires_in: 0,
        expires_at: 0,
        refresh_token: 0,
        user,
      },
    },
    count: 0,
    status: 0,
    statusText: "",
  };

  return result;
};

export const getUser: GetUserFun = (supaCreds: string) => {
  const user = {
    id: "",
    aud: "",
    role: "",
    email: "",
    email_confirmed_at: "",
    phone: "",
    confirmed_at: "",
    last_sign_in_at: "",
    app_metadata: { provider: "", providers: [""] },
    user_metadata: {},
    identities: [],
    created_at: "",
    updated_at: "",
  };
  const result: SQLiteQueryResult<{ user: User }> = {
    error: null,
    data: { user },
    count: 0,
    status: 0,
    statusText: "",
  };
  return result;
};

export function from(tableName: FromTableNames) {
  return {
    select: select_(tableName),
    insert: insert_(tableName),
    update: update_(tableName),
    delete: delete_(tableName),
    upsert: upsert_(tableName),
  };
}

function select_(tableName: string) {
  return {};
}

function insert_(tableName: string) {
  return {};
}

function update_(tableName: string) {
  return {};
}

function delete_(tableName: string) {
  return {};
}

function upsert_(tableName: string) {
  return {};
}
