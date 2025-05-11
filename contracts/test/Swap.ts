// test/Swap.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import type { Token, Swap } from "../typechain-types";
import { Token__factory, Swap__factory, MockRouter__factory } from "../typechain-types";

describe("Swap Contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let fromToken: Token;
  let toToken: Token;
  let swap: Swap;

  beforeEach(async () => {
    [owner, addr1] = (await ethers.getSigners()) as SignerWithAddress[];

    // Deploy the mock router
    const mockRouterFactory = (await ethers.getContractFactory("MockRouter")) as MockRouter__factory;
    const mockRouter = await mockRouterFactory.connect(owner).deploy();

    // Deploy two tokens
    const tokenFactory = (await ethers.getContractFactory("Token")) as Token__factory;
    fromToken = await tokenFactory.connect(owner).deploy("FromToken", "FROM", 0);
    toToken   = await tokenFactory.connect(owner).deploy("ToToken",   "TO",   0);

    // Deploy Swap, injecting our mock router address
    const swapFactory = (await ethers.getContractFactory("Swap")) as Swap__factory;
    swap = await swapFactory.connect(owner).deploy(mockRouter.target);
  });

  it("Should perform a swap", async () => {
    const mintAmount = ethers.parseEther("100");

    // Mint tokens into addr1
    await fromToken.mint(await addr1.getAddress(), mintAmount);

    // Approve the mock router to pull `fromToken` from addr1
    await fromToken.connect(addr1).approve(swap.target, mintAmount);

    // Execute swap: MockRouter just sends back a 1:1 amount
    await swap.connect(addr1).swap(
      fromToken.target,
      toToken.target,
      mintAmount
    );

    // Check that addr1 received exactly `mintAmount` of toToken
    const received = await toToken.balanceOf(await addr1.getAddress());
    expect(received).to.equal(mintAmount);
  });
});
