import { task } from "hardhat/config";
import {
  CTokenAddress,
  UniswapV2Factory,
  UniswapV2Router02,
  UniswapWETH,
} from "../src/utils/config";
import { NearLiquidator__factory } from "../typechain";

task("deploy", "Deploy NearLiquidator contract").setAction(
  async (_taskArgs, { ethers }) => {
    const [signer] = await ethers.getSigners();
    const factory = new NearLiquidator__factory(signer);
    const liquidatorContract = await factory.deploy(
      CTokenAddress[0].cETH,
      UniswapWETH,
      UniswapV2Router02,
      UniswapV2Factory
    );
    console.log("Liquidator contract deployed at ", liquidatorContract.address);
  }
);
