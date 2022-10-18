import { ethers } from "ethers";

/**
 * Liquidator address contract
 */
export const NearLiquidator = "<Liquidator contract address>";

export type TPoolAddress = {
  Comptroller: string;
  Oracle: string;
  Maximillion?: string;
  Markets: Array<{
    address: string;
    underlying: string;
  }>;
};

export const TokenAddress = {
  UniswapWETH: "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",

  WBTC: "0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
  NEAR: "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
  USDC: "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
  USDT: "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",

  AURORA: "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
  STNEAR: "0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30",
  TRI: "0xFa94348467f64D5A457F75F8bc40495D33c65aBB",
};

const REALM_ID_MAP = {
  MAIN_HUB: 0,
  AURORA_REALM: 1,
  MULTICHAIN_REALM: 2,
  STAKED_NEAR_REALM: 3,
};

export const CTokenAddress: { [id: number]: { [cSymbol: string]: string } } = {
  [REALM_ID_MAP.MAIN_HUB]: {
    cBTC: "0xfa786baC375D8806185555149235AcDb182C033b",
    cETH: "0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0",
    cNEAR: "0x8C14ea853321028a7bb5E4FB0d0147F183d3B677",
    cUSDC: "0xe5308dc623101508952948b141fD9eaBd3337D99",
    cUSDT: "0x845E15A441CFC1871B7AC610b0E922019BaD9826",
  },
  [REALM_ID_MAP.AURORA_REALM]: {
    cstNEAR: "0x30Fff4663A8DCDd9eD81e60acF505e6159f19BbC",
    cUSDC: "0x10a9153A7b4da83Aa1056908C710f1aaCCB3Ef85",
  },
  [REALM_ID_MAP.MULTICHAIN_REALM]: {
    cAURORA: "0x94FA9979751a74e6b133Eb95Aeca8565c0809BaB",
    cUSDC: "0x8E9FB3f2cc8b08184CB5FB7BcDC61188E80C3cB0",
    cTRI: "0x86538Ca055E7Fd992A26c5604F349e2ede3ce42D",
  },
  [REALM_ID_MAP.STAKED_NEAR_REALM]: {
    cNEAR: "0x728302DEE7e399021bA274242Aa26caD076b419D",
    cstNEAR: "0xa400D048ceB81B5e9C1d0904Dab39d3c877350a0",
  },
};

export const TokenDecimals = {
  ETH: 18,

  WBTC: 8,
  NEAR: 24,
  USDC: 6,
  USDT: 6,

  AURORA: 18,
  STNEAR: 24,
  TRI: 18,
};

export const MAIN_POOL: TPoolAddress = {
  Comptroller: "0x6De54724e128274520606f038591A00C5E94a1F6",
  Oracle: "0x91A99a522D6fc3A424701B875497279C426C1D70",
  Maximillion: "0x9ee25DE4C39CFFD97b3bc9975A25B92dD1489E6D",
  Markets: [
    {
      address: CTokenAddress[REALM_ID_MAP.MAIN_HUB].cBTC!,
      underlying: TokenAddress.WBTC,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.MAIN_HUB].cETH!,
      underlying: ethers.constants.AddressZero,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.MAIN_HUB].cNEAR!,
      underlying: TokenAddress.NEAR,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.MAIN_HUB].cUSDC!,
      underlying: TokenAddress.USDC,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.MAIN_HUB].cUSDT!,
      underlying: TokenAddress.USDT,
    },
  ],
};

export const AURORA_POOL: TPoolAddress = {
  Comptroller: "0xA195b3d7AA34E47Fb2D2e5A682DF2d9EFA2daF06",
  Oracle: "0x71EbeA24B18f6ecF97c5a5bCaEf3e0639575f08C",
  Markets: [
    {
      address: CTokenAddress[REALM_ID_MAP.AURORA_REALM].cstNEAR!,
      underlying: TokenAddress.STNEAR,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.AURORA_REALM].cUSDC!,
      underlying: TokenAddress.USDC,
    },
  ],
};

export const MULTICHAIN_POOL: TPoolAddress = {
  Comptroller: "0xe1cf09BDa2e089c63330F0Ffe3F6D6b790835973",
  Oracle: "0x4Fa59CaE2b1e0d3BBADB3385Ba29B0B35822e8aD",
  Markets: [
    {
      address: CTokenAddress[REALM_ID_MAP.MULTICHAIN_REALM].cAURORA!,
      underlying: TokenAddress.AURORA,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.MULTICHAIN_REALM].cUSDC!,
      underlying: TokenAddress.USDC,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.MULTICHAIN_REALM].cTRI!,
      underlying: TokenAddress.TRI,
    },
  ],
};

export const STAKED_NEAR_POOL: TPoolAddress = {
  Comptroller: "0x9Ec6D28D39433bb7C5e2120380B78aCd440BFdd0",
  Oracle: "0xB85E4CbddAb1Eb50FC47fBf4DE8DEff0A65EF648",
  Markets: [
    {
      address: CTokenAddress[REALM_ID_MAP.STAKED_NEAR_REALM].cNEAR!,
      underlying: TokenAddress.NEAR,
    },
    {
      address: CTokenAddress[REALM_ID_MAP.STAKED_NEAR_REALM].cstNEAR!,
      underlying: TokenAddress.STNEAR,
    },
  ],
};

export const UniswapV2Router02 = "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B";
export const UniswapV2Factory = "0xc66F594268041dB60507F00703b152492fb176E7";
export const UniswapWETH = TokenAddress.UniswapWETH;
