import { ethers } from "$ethers";

export function validateAddress(address: string) {
  return ethers.isAddress(address);
}

// I need to implement the server side Contract functions here with ethers js
