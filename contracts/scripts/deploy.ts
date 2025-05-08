// scripts/deploy.ts

import { ethers, artifacts } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, {
    value: ethers.parseEther("1.0"),
  });

  await lock.waitForDeployment();

  const contractAddress = await lock.getAddress();
  console.log("Lock contract deployed to:", contractAddress);

  // Load ABI from artifacts
  const artifact = await artifacts.readArtifact("Lock");

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    contract: {
      name: "Lock",
      address: contractAddress,
      abi: artifact.abi,
      deployedAt: new Date().toISOString(),
    },
  };

  const deploymentsDir = path.join(__dirname, "../deployment");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "sepolia.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment/sepolia.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
