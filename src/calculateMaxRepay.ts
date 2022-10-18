import { ethers } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ICTokenInterface__factory, IPriceOracle__factory } from "../typechain";

const CLOSE_FACTOR = ethers.utils.parseUnits("0.5", 18);
const LIQUIDATION_INCENTIVE = ethers.utils.parseUnits("1.08", 18);
const EXP_FACTOR = ethers.utils.parseUnits("1", 18);

export default async function calculateMaxRepay(
  signer: SignerWithAddress,
  borrower: string,
  repayCTokenAddress: string,
  seizeCTokenAddress: string,
  oracleAddress: string
): Promise<[ethers.BigNumber, ethers.BigNumber]> {
  const repayCToken = ICTokenInterface__factory.connect(
    repayCTokenAddress,
    signer
  );
  const seizeCToken = ICTokenInterface__factory.connect(
    seizeCTokenAddress,
    signer
  );
  const oracle = IPriceOracle__factory.connect(oracleAddress, signer);

  const borrowBalance = await repayCToken.callStatic.borrowBalanceCurrent(
    borrower
  );
  let repayMax = borrowBalance.mul(CLOSE_FACTOR).div(EXP_FACTOR);

  const collateralBalance = await seizeCToken.callStatic.balanceOfUnderlying(
    borrower
  );
  let seizeMax = collateralBalance.mul(EXP_FACTOR).div(LIQUIDATION_INCENTIVE);

  const priceRepay = await oracle.getUnderlyingPrice(repayCToken.address);
  repayMax = repayMax.mul(priceRepay);

  const priceSeize = await oracle.getUnderlyingPrice(seizeCToken.address);
  seizeMax = seizeMax.mul(priceSeize);

  const amountUsd = repayMax.lt(seizeMax) ? repayMax : seizeMax;
  const amount = amountUsd.div(priceRepay);

  return [amount.mul(97).div(100), amountUsd];
}
