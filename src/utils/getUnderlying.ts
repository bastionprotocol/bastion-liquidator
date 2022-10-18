import { TokenAddress, TokenDecimals } from "./config";
import getPoolAddressFromCTokenAddress from "./getPoolAddress";

export default function getUnderlying(
  cTokenAddress: string
): [string, string, number] {
  const POOL = getPoolAddressFromCTokenAddress(cTokenAddress);

  if (!POOL) {
    throw new Error("Invalid CToken Address");
  }

  const market = POOL.Markets.find(
    (market) => market.address.toLowerCase() === cTokenAddress.toLowerCase()
  );

  if (!market) {
    throw new Error("Invalid CToken Address");
  }

  const tokens = Object.entries(TokenAddress).find(
    ([, address]) => address.toLowerCase() === market.underlying.toLowerCase()
  );

  const symbol = tokens ? tokens[0] : "ETH";

  const decimals = TokenDecimals[symbol as keyof typeof TokenDecimals];

  return [symbol, market.underlying, decimals];
}
