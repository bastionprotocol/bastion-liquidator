import { ethers } from "ethers";
import { TokenAddress } from "./config";

export default function toUniswapTokenAddress(address: string): string {
  return address === ethers.constants.AddressZero
    ? TokenAddress.UniswapWETH
    : address;
}
