import { TokenAddress } from "./config";
import getSwapPath from "./getSwapPath";
import getUnderlying from "./getUnderlying";
import toUniswapTokenAddress from "./toUniswapTokenAddress";

// Nested index sorted by address
const DIRECT_PAIRS = {
  [TokenAddress.AURORA]: {
    [TokenAddress.TRI]: "0xd1654a7713617d41A8C9530Fb9B948d00e162194",
  },
  [TokenAddress.USDT]: {
    [TokenAddress.USDC]: "0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77",
    [TokenAddress.NEAR]: "0x03B666f3488a7992b2385B12dF7f35156d7b29cD",
  },
  [TokenAddress.NEAR]: {
    [TokenAddress.TRI]: "0x84b123875F0F36B966d0B6Ca14b31121bd9676AD",
    [TokenAddress.WBTC]: "0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb",
    [TokenAddress.UniswapWETH]: "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198",
  },
  [TokenAddress.USDC]: {
    [TokenAddress.NEAR]: "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0",
  },
  [TokenAddress.STNEAR]: {
    [TokenAddress.NEAR]: "0x47924Ae4968832984F4091EEC537dfF5c38948a4",
  },
};

export default function getPairAndPath(
  repayTokenAddress: string,
  seizeTokenAddress: string
): [
  string, // pair
  string[], //path
  boolean // isToken0
] {
  const [tokenA, tokenB] = [repayTokenAddress, seizeTokenAddress]
    .map(toUniswapTokenAddress)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  console.log("tokenA, tokenB", tokenA, tokenB);

  if (tokenA in DIRECT_PAIRS && tokenB in DIRECT_PAIRS[tokenA]) {
    return [DIRECT_PAIRS[tokenA][tokenB], [], tokenA === repayTokenAddress];
  } else {
    const [tokenA, tokenB] = [repayTokenAddress, TokenAddress.NEAR].sort();
    return [
      DIRECT_PAIRS[tokenA][tokenB],
      getSwapPath(seizeTokenAddress, TokenAddress.NEAR),
      tokenA === repayTokenAddress,
    ];
  }
}
