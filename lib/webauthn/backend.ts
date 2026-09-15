import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticatorTransport,
  WebAuthnCredential,
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
  // SQL: base64url string, store as `TEXT`. Index this column.
  // As of @simplewebauthn/server v10+, this is what the library
  // itself returns and expects — no more manual buffer <-> string
  // conversion for the ID.
  credentialID: string;
  // SQL: base64url string, store as `TEXT`. The library returns this
  // as a Uint8Array; we base64url-encode it for storage and decode it
  // back to Uint8Array whenever we call verifyAuthenticationResponse.
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

export type AccountAuthenticator = Authenticator & {
  name: string;
  disabled: boolean;
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
    // v10+: userID must be a Uint8Array (it used to be a plain string).
    // We deterministically encode the existing string user id as UTF-8
    // bytes so the same DB id always maps to the same WebAuthn user handle.
    userID: encodeUserID(user.id),
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    authenticatorSelection: {
      userVerification: "preferred",
    },
    // Prevent users from re-registering existing authenticators.
    // v10+: id is now a plain base64url string and no `type` field is needed.
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      transports: JSON.parse(
        authenticator.transports,
      ) as AuthenticatorTransport[],
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
  } catch (err: any) {
    console.error(err);
    return [false, err.message];
  }
  // NOTE for callers: verification.registrationInfo shape changed in v10+.
  // credentialID / credentialPublicKey / counter used to be top-level
  // properties on registrationInfo; they now live under
  // registrationInfo.credential:
  //
  //   const { credential, credentialDeviceType, credentialBackedUp } =
  //     verification.registrationInfo;
  //   await storeAuthenticator({
  //     credentialID: credential.id, // already a base64url string
  //     credentialPublicKey: encodeUint8ArrayToBase64(credential.publicKey),
  //     counter: credential.counter,
  //     credentialDeviceType,
  //     credentialBackedUp,
  //   });
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
      // v10+: the `authenticator` option was renamed to `credential`, and
      // its shape changed to WebAuthnCredential: id is a base64url string
      // (not a buffer), publicKey is a Uint8Array, counter is unchanged.
      credential: {
        id: authenticator.credentialID,
        publicKey: decodeUint8ArrayFromBase64(
          authenticator.credentialPublicKey,
        ),
        counter: authenticator.counter,
        transports: JSON.parse(
          authenticator.transports,
        ) as AuthenticatorTransport[],
      } satisfies WebAuthnCredential,
    });
  } catch (err:any) {
    return [false, err.message];
  }
  return [true, verification];
}

export async function getAuthenticationOptions(
  userAuthenticators: Authenticator[],
) {
  return await generateAuthenticationOptions({
    rpID,
    // Require users to use a previously-registered authenticator.
    // v10+: id is now a plain base64url string and no `type` field is needed.
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      transports: JSON.parse(
        authenticator.transports,
      ) as AuthenticatorTransport[],
    })),
    userVerification: "preferred",
  });
}

/**
 * Deterministically turn our existing string user IDs into the
 * Uint8Array that generateRegistrationOptions() now requires for `userID`.
 *
 * TextEncoder#encode() is typed as Uint8Array<ArrayBufferLike>, but the
 * library's types want the stricter Uint8Array<ArrayBuffer>. Copying it
 * through the `new Uint8Array(typedArray)` overload gives us a fresh,
 * plain-ArrayBuffer-backed array that satisfies that type.
 */
function encodeUserID(id: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(new TextEncoder().encode(id));
}

export function encodeUint8ArrayToBase64(
  u8: Uint8Array<ArrayBufferLike> | ArrayBuffer,
) {
  return bufferToBase64URLString(u8);
}

export function decodeUint8ArrayFromBase64(b64: string): Uint8Array<ArrayBuffer> {
  return base64URLStringToBuffer(b64);
}

/**
 * Convert the given array buffer into a Base64URL-encoded string. Ideal for converting various
 * credential response ArrayBuffers to string for sending back to the server as JSON.
 *
 * Helper method to compliment `base64URLStringToBuffer`
 */
function bufferToBase64URLString(
  buffer: Uint8Array<ArrayBufferLike> | ArrayBuffer,
): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let str = "";

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Convert from a Base64URL-encoded string to a Uint8Array. Best used when converting a
 * credential ID or public key from a JSON/DB string into the byte form the
 * library now expects (e.g. WebAuthnCredential.publicKey).
 *
 * Helper method to compliment `bufferToBase64URLString`
 */
function base64URLStringToBuffer(
  base64URLString: string,
): Uint8Array<ArrayBuffer> {
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

  // Convert binary string to a plain-ArrayBuffer-backed Uint8Array.
  // `new Uint8Array(length)` allocates its own fresh ArrayBuffer, which is
  // exactly the Uint8Array<ArrayBuffer> shape WebAuthnCredential.publicKey
  // requires (as opposed to the looser ArrayBufferLike some other
  // construction paths produce).
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

// for authenticators with a largeBlob extension!
export async function getRegistrationOptionsWithLargeBlob(
  user: PasskeyUserModel,
  userAuthenticators: Authenticator[],
) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: encodeUserID(user.id),
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
    extensions: {
      // largeBlob isn't in the standard AuthenticationExtensionsClientInputs
      // TS type yet, even though browsers/authenticators support it.
      // @ts-ignore this extension is real, the DOM types just haven't caught up
      largeBlob: {
        support: "preferred",
      },
    },
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      transports: JSON.parse(
        authenticator.transports,
      ) as AuthenticatorTransport[],
    })),
  });
  return options;
}

export async function getAuthenticationOptionsWithLargeBlobRead(
  userAuthenticators: Authenticator[],
) {
  return await generateAuthenticationOptions({
    rpID,
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      transports: JSON.parse(
        authenticator.transports,
      ) as AuthenticatorTransport[],
    })),
    userVerification: "preferred",
    extensions: {
      // @ts-ignore this extension is real, the DOM types just haven't caught up
      largeBlob: {
        read: true,
      },
    },
  });
}

export async function getAuthenticationOptionsWithLargeBlobWrite(
  userAuthenticators: Authenticator[],
) {
  return await generateAuthenticationOptions({
    rpID,
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      transports: JSON.parse(
        authenticator.transports,
      ) as AuthenticatorTransport[],
    })),
    userVerification: "preferred",
    extensions: {
      // @ts-ignore this extension is real, the DOM types just haven't caught up
      largeBlob: {
        write: new Uint8Array(1),
      },
    },
  });
}