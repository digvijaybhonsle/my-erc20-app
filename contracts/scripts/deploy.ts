// scripts/deploy.ts

import { ethers, artifacts } from "hardhat";
import fs from "fs/promises";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.01")) {
    throw new Error("Insufficient balance to deploy contract. Please fund the account.");
  }

  const unlockTime = Math.floor(Date.now() / 1000) + 3600;

  const Lock = await ethers.getContractFactory("Lock");

  // Estimate gas for deployment
  const deploymentTx = Lock.getDeployTransaction(unlockTime);
  const estimatedGas = await ethers.provider.estimateGas({
    ...deploymentTx,
    from: deployer.address,
  });

  console.log("Estimated deployment gas:", estimatedGas.toString());

  const lock = await Lock.deploy(unlockTime);
  await lock.waitForDeployment();

  const contractAddress = await lock.getAddress();
  console.log("Lock contract deployed to:", contractAddress);

  const artifact = await artifacts.readArtifact("Lock");

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
  await fs.mkdir(deploymentsDir, { recursive: true });
  await fs.writeFile(
    path.join(deploymentsDir, "sepolia.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment/sepolia.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
