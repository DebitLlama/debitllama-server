export type IdentityData = {
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: { provider: string; providers: string[] };
  user_metadata: any;
  identities: IdentityData[];
  created_at: string;
  updated_at: string;
};

export type UserSession = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  expires_at: number;
  refresh_token: number;
  user: User;
};

export type UserData = {
  user: User;
  session: null | UserSession;
};

export type SQLiteErrorType = null | {
  message: string;
  status: number;
  name: string;
};

export type SQLiteQueryResult<T> = {
  error: SQLiteErrorType;
  data: T;
  count: any;
  status: number;
  statusText: string;
};

//This runs at signup
export type SignUpFun = (
  email: string,
  password: string,
) => SQLiteQueryResult<UserData>;

//This runs at login
export type SignInWithPasswordFun = (
  email: string,
  password: string,
) => SQLiteQueryResult<UserData>;

export type GetUserFun = (
  supaCreds: string,
) => SQLiteQueryResult<{ user: User }>;

export const FromTableNamesList = [
  "Accounts",
  "ApiAuthTokens",
  "Authenticators",
  "DynamicPaymentRequestJobs",
  "Feedback",
  "Items",
  "PasswordResetUrls",
  "PaymentIntents",
  "Profiles",
  "RelayerBalance",
  "RelayerHistory",
  "RelayerTopUpHistory",
  "Test",
  "UserChallenges",
  "VerifiedEmail",
  "Webhooks",
] as const;

export type FromTableNames = typeof FromTableNamesList[number];

export type Mapping = any;

export type From = (from: FromTableNames) => Mapping;

export interface SQLiteClient {
  auth: {
    signUp: SignUpFun;
    signInWithPassword: SignInWithPasswordFun;
    getUser: GetUserFun;
  };
  from: From;
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'cs'
  | 'cd'
  | 'sl'
  | 'sr'
  | 'nxl'
  | 'nxr'
  | 'adj'
  | 'ov'
  | 'fts'
  | 'plfts'
  | 'phfts'
  | 'wfts'
