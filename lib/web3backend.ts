import { ethers } from "$ethers";

export function validateAddress(address: string) {
  return ethers.isAddress(address);
}
