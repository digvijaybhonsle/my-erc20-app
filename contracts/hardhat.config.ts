import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";       // includes nomicfoundation/ethers
import "@nomicfoundation/hardhat-ethers";        // explicit ethers-v6 plugin
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests:   "./test",
    cache:   "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    sepolia: {
      url:      process.env.ALCHEMY_URL ?? "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
