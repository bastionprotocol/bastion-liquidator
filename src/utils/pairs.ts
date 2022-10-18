import { TokenAddress } from "./config";
import getUnderlying from "./getUnderlying";
import toUniswapTokenAddress from "./toUniswapTokenAddress";

export const TrisolarisPair = [
  {
    address: "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198",
    token0: TokenAddress.NEAR,
    token1: TokenAddress.UniswapWETH,
  },
  {
    address: "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0",
    token0: TokenAddress.USDC,
    token1: TokenAddress.NEAR,
  },
  {
    address: "0x03B666f3488a7992b2385B12dF7f35156d7b29cD",
    token0: TokenAddress.USDT,
    token1: TokenAddress.NEAR,
  },
  {
    address: "0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77",
    token0: TokenAddress.USDT,
    token1: TokenAddress.USDC,
  },
  {
    address: "0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb",
    token0: TokenAddress.NEAR,
    token1: TokenAddress.WBTC,
  },
];

function compare(a: string, b: string) {
  return a.localeCompare(b);
}

export default function findDirectPair(
  repayCTokenAddress: string,
  seizeCTokenAddress: string
): { address: string; token0: string; token1: string } {
  const repayTokenAddress = toUniswapTokenAddress(
    getUnderlying(repayCTokenAddress)[1]
  );
  let seizeTokenAddress = toUniswapTokenAddress(
    getUnderlying(seizeCTokenAddress)[1]
  );

  if (repayCTokenAddress === seizeCTokenAddress) {
    seizeTokenAddress = TokenAddress.NEAR;
  }

  const idx = TrisolarisPair.map((pair) =>
    [pair.token0, pair.token1].sort(compare).join("")
  ).findIndex(
    (pair) =>
      pair === [repayTokenAddress, seizeTokenAddress].sort(compare).join("")
  );

  if (idx === -1) {
    const idx2 = TrisolarisPair.map((pair) =>
      [pair.token0, pair.token1].sort(compare).join("")
    ).findIndex((pair) => pair.includes(repayTokenAddress));
    return TrisolarisPair[idx2];
  } else {
    return TrisolarisPair[idx];
  }
}
