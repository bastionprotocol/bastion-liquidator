import { task } from "hardhat/config";
import flashLiquidate from "../src/flashLiquidate";

task("liquidate", "Liquidate a undercollateralized borrow position")
  .addParam("address", "The address of user with liquidatable position")
  .addParam("ctokenborrowed", "The address of borrowed ctoken")
  .addParam("ctokencollateral", "The address of collateral ctoken")
  .setAction(async (taskArgs, { ethers }) => {
    const borrower = ethers.utils.getAddress(taskArgs.address);
    const repayCTokenAddress = ethers.utils.getAddress(taskArgs.ctokenborrowed);
    const seizeCTokenAddress = ethers.utils.getAddress(
      taskArgs.ctokencollateral
    );
    console.log(
      "repayCTokenAddress, seizeCTokenAddress",
      repayCTokenAddress,
      seizeCTokenAddress
    );

    const [signer] = await ethers.getSigners();
    await flashLiquidate(
      signer,
      borrower,
      repayCTokenAddress,
      seizeCTokenAddress
    );
  });
