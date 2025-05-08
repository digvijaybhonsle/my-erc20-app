import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock Contract", function () {

  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    const lockedAmount = ethers.parseEther("0.01"); // Only 0.01 ETH

    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the correct unlock time", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should assign ownership to the deployer", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);
      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should accept and store ETH", async function () {
      const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture);
      const contractBalance = await ethers.provider.getBalance(lock.target);
      expect(contractBalance).to.equal(lockedAmount);
    });

    it("Should revert if unlock time is not in the future", async function () {
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(
        Lock.deploy(latestTime, { value: 1 })
      ).to.be.revertedWith("Unlock time should be in the future");
    });
  });

  describe("Withdrawals", function () {

    describe("Validations", function () {
      it("Should revert if withdrawn too early", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);
        await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
      });

      it("Should revert if called by a non-owner", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
      });

      it("Should allow withdrawal by the owner after unlock time", async function () {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit a Withdrawal event", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue);
      });
    });

    describe("Transfers", function () {
      it("Should transfer locked funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(() => lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });

  });
});
