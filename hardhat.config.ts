import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "./tasks";

if (typeof process.env["PRIVATE_KEY"] !== "string") {
  throw new Error("Missing PRIVATE_KEY in .env");
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.10",
      },
    ],
  },
  defaultNetwork: "aurora",
  networks: {
    aurora: {
      url: "https://mainnet.aurora.dev",
      accounts: [process.env["PRIVATE_KEY"]],
      chainId: 1313161554,
    },
  },
};

export default config;
