import {
  AURORA_POOL,
  MAIN_POOL,
  MULTICHAIN_POOL,
  STAKED_NEAR_POOL,
  TPoolAddress,
} from "./config";

export default function getPoolAddressFromCTokenAddress(
  cTokenAddress: string
): TPoolAddress {
  const POOLS = [MAIN_POOL, AURORA_POOL, MULTICHAIN_POOL, STAKED_NEAR_POOL];

  const POOLS_MARKETS_ADDRESS = POOLS.map((pool) =>
    pool.Markets.map((market) => market.address.toLowerCase())
  );

  const idx = POOLS_MARKETS_ADDRESS.findIndex((marketsAddress) =>
    marketsAddress.includes(cTokenAddress.toLowerCase())
  );

  return POOLS[idx];
}
