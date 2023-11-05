import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

export type PasskeyUserModel = {
  id: string;
  username: string;
  currentChallenge?: string;
};

/**
 * It is strongly advised that authenticators get their own DB
 * table, ideally with a foreign key to a specific UserModel.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
export type Authenticator = {
  // SQL: Encode to base64url then store as `TEXT`. Index this column
  credentialID: string;
  // Encoded as base64 also, uint8Array by default
  credentialPublicKey: string;
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: number;
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  credentialDeviceType: "singleDevice" | "multiDevice"; //CredentialDeviceType;
  // SQL: `BOOL` or whatever similar type is supported
  credentialBackedUp: boolean;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
  //AuthenticatorTransport[]
  transports: string;
};

const rpName = "Debit Llama";

const env = Deno.env.get("ENV") || "";

const rpID = env === "development" ? "localhost" : "debitllama.com";
const origin = [`https://${rpID}`, "http://localhost:3000"];

export async function getRegistrationOptions(
  user: PasskeyUserModel,
  userAuthenticators: Authenticator[],
) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    authenticatorSelection: {
      userVerification: "preferred",
    },
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: decodeUint8ArrayFromBase64(authenticator.credentialID),
      type: "public-key",
      // Optional
      transports: JSON.parse(authenticator.transports),
    })),
  });
  return options;
}

export async function verifyRegistration(
  body: any,
  user: PasskeyUserModel,
) {
  let verification;

  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: user.currentChallenge as string,
      expectedOrigin: origin,
      expectedRPID: [rpID, "localhost"],
    });
  } catch (err) {
    console.error(err);
    return [false, err.message];
  }
  return [true, verification];
}

export async function verifyAuthentication(
  body: any,
  user: PasskeyUserModel,
  authenticator: Authenticator,
) {
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: user.currentChallenge as string,
      expectedOrigin: origin,
      expectedRPID: [rpID, "localhost"],
      authenticator: {
        //@ts-ignore This just works
        credentialID: decodeUint8ArrayFromBase64(authenticator.credentialID),
        counter: authenticator.counter,
        //@ts-ignore I call upon the JS gods to aid me
        credentialPublicKey: decodeUint8ArrayFromBase64(
          authenticator.credentialPublicKey,
        ),
      },
    });
  } catch (err) {
    return [false, err.message];
  }
  return [true, verification];
}

export async function getAuthenticationOptions(
  userAuthenticators: Authenticator[],
) {
  return await generateAuthenticationOptions({
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: decodeUint8ArrayFromBase64(authenticator.credentialID),
      type: "public-key",
      // Optional
      transports: JSON.parse(authenticator.transports),
    })),
    userVerification: "preferred",
  });
}

export function encodeUint8ArrayToBase64(u8: any) {
  return bufferToBase64URLString(u8);
}

export function decodeUint8ArrayFromBase64(b64: string) {
  return base64URLStringToBuffer(b64);
}

/**
 * Convert the given array buffer into a Base64URL-encoded string. Ideal for converting various
 * credential response ArrayBuffers to string for sending back to the server as JSON.
 *
 * Helper method to compliment `base64URLStringToBuffer`
 */
function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Convert from a Base64URL-encoded string to an Array Buffer. Best used when converting a
 * credential ID from a JSON string to an ArrayBuffer, like in allowCredentials or
 * excludeCredentials
 *
 * Helper method to compliment `bufferToBase64URLString`
 */
function base64URLStringToBuffer(base64URLString: string): ArrayBuffer {
  // Convert from Base64URL to Base64
  const base64 = base64URLString.replace(/-/g, "+").replace(/_/g, "/");
  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64.padEnd(base64.length + padLength, "=");

  // Convert to a binary string
  const binary = atob(padded);

  // Convert binary string to buffer
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return buffer;
}

// for authenticators with a largeBlob extension!
export async function getRegistrationOptionsWithLargeBlob(
  user: PasskeyUserModel,
  userAuthenticators: Authenticator[],
) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
    extensions: {
      //@ts-ignore it's not in the type but I need to request this extension!
      largeBlob: {
        support: "preferred",
      },
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: decodeUint8ArrayFromBase64(authenticator.credentialID),
        type: "public-key",
        // Optional
        transports: JSON.parse(authenticator.transports),
      })),
    },
  });
  return options;
}
