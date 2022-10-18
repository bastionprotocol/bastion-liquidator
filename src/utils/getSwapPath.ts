import { ethers } from "ethers";
import { TokenAddress } from "./config";

const PATHS = {
  [TokenAddress.NEAR]: {
    [TokenAddress.AURORA]: [TokenAddress.NEAR, TokenAddress.AURORA],
    [TokenAddress.STNEAR]: [TokenAddress.NEAR, TokenAddress.STNEAR],
    [TokenAddress.USDC]: [TokenAddress.NEAR, TokenAddress.USDC],
    [TokenAddress.USDT]: [TokenAddress.NEAR, TokenAddress.USDT],
    [ethers.constants.AddressZero]: [
      TokenAddress.NEAR,
      TokenAddress.UniswapWETH,
    ],
    [TokenAddress.WBTC]: [TokenAddress.NEAR, TokenAddress.WBTC],
    [TokenAddress.TRI]: [TokenAddress.NEAR, TokenAddress.TRI],
  },
  [TokenAddress.USDC]: {
    [TokenAddress.STNEAR]: [
      TokenAddress.USDC,
      TokenAddress.NEAR,
      TokenAddress.STNEAR,
    ],
  },
};

export default function getSwapPath(
  tokenIn: string,
  tokenOut: string
): string[] {
  if (tokenIn.toLowerCase() === TokenAddress.NEAR.toLowerCase()) {
    return PATHS[tokenIn][tokenOut];
  } else if (tokenOut.toLocaleLowerCase() === TokenAddress.NEAR.toLowerCase()) {
    return [...PATHS[tokenOut][tokenIn]].reverse();
  } else if (tokenIn in PATHS) {
    return PATHS[tokenIn][tokenOut];
  } else if (tokenOut in PATHS) {
    return PATHS[tokenOut][tokenIn];
  } else {
    throw new Error("No Path specified");
  }
}
