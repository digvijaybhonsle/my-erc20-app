// scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, {
    value: ethers.parseEther("1.0"), // Ethers v6 uses parseEther directly from ethers
  });

  await lock.waitForDeployment(); // Use waitForDeployment instead of .deployed()

  console.log("Lock contract deployed to:", await lock.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
