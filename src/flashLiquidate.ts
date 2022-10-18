import { ethers } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import calculateMaxRepay from "./calculateMaxRepay";
import getPoolAddressFromCTokenAddress from "./utils/getPoolAddress";
import getUnderlying from "./utils/getUnderlying";
import toUniswapTokenAddress from "./utils/toUniswapTokenAddress";
import findDirectPair from "./utils/pairs";
import { NearLiquidator } from "./utils/config";

import { IComptroller__factory, NearLiquidator__factory } from "../typechain";

export default async function flashLiquidate(
  signer: SignerWithAddress,
  borrower: string,
  repayCTokenAddress: string,
  seizeCTokenAddress: string
): Promise<void> {
  const pair = findDirectPair(repayCTokenAddress, seizeCTokenAddress);
  const FlashLiquidator = NearLiquidator__factory.connect(
    NearLiquidator,
    signer
  );

  const repayTokenAddress = toUniswapTokenAddress(
    getUnderlying(repayCTokenAddress)[1]
  );

  const POOLADDRESS = getPoolAddressFromCTokenAddress(repayCTokenAddress);
  console.log("repayTokenAddress", repayTokenAddress);
  console.log("pair", pair);
  if (pair) {
    console.log("Calculating Max Repay");
    const [maxRepay] = await calculateMaxRepay(
      signer,
      borrower,
      repayCTokenAddress,
      seizeCTokenAddress,
      POOLADDRESS.Oracle
    );
    console.log("maxRepay", maxRepay);

    const comptroller = IComptroller__factory.connect(
      POOLADDRESS.Comptroller,
      signer
    );
    const status = await comptroller.callStatic.liquidateBorrowAllowed(
      repayCTokenAddress,
      seizeCTokenAddress,
      signer.address,
      borrower,
      maxRepay
    );
    console.log("status", status.toString());
    if (!status.eq(0)) {
      return;
    }
    console.log("Max Repay: ", maxRepay.toString());
    const coder = new ethers.utils.AbiCoder();
    const data = coder.encode(
      ["address", "address", "address", "address[]"],
      [borrower, repayCTokenAddress, seizeCTokenAddress, []]
    );

    console.log("repayTokenAddress", repayTokenAddress);
    const [amount0, amount1] =
      repayTokenAddress.toLowerCase() === pair.token0.toLowerCase()
        ? [maxRepay, 0]
        : [0, maxRepay];

    console.log("amount0", amount0);
    console.log("token0", pair.token0);
    console.log("amount1", amount1);
    console.log("token1", pair.token1);

    console.log("Liquidating...", pair.address, amount0, amount1, data);
    const tx = await FlashLiquidator.liquidate(
      pair.address,
      amount0,
      amount1,
      data
    );
    console.log("Liquidated at ", tx.hash);
  } else {
    console.log("❌ Direct Pair does not exist!");
  }
}
