import { config } from "../config";
import { ethers } from "ethers";
import deploymentData from "../../../contracts/deployment/sepolia.json";

class EthereumService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;
  public serverAddress: string;

  constructor() {
    // 1) RPC
    this.provider = new ethers.JsonRpcProvider(config.ALCHEMY_URL);

    // 2) Server wallet
    this.signer = new ethers.Wallet(config.PRIVATE_KEY, this.provider);

    this.serverAddress = this.signer.address;

    // 3) Contract
    const {
      contract: { address, abi },
    } = deploymentData as {
      contract: { address: string; abi: any };
    };

    this.contract = new ethers.Contract(address, abi, this.signer);
  }

  async getEthBalance(address: string): Promise<string> {
    const bal = await this.provider.getBalance(address);
    return ethers.formatEther(bal);
  }

  async getTokenBalance(address: string): Promise<string> {
    const bal = await this.contract.balanceOf(address);
    return ethers.formatUnits(bal, 18);
  }

  async transferTokens(to: string, amt: string): Promise<string> {
    const tx = await this.contract.transfer(to, ethers.parseUnits(amt, 18));
    await tx.wait();
    return tx.hash;
  }

  async sendEth(to: string, amt: string): Promise<string> {
    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(amt),
    });
    await tx.wait();
    return tx.hash;
  }
}

export const ethereumService = new EthereumService();
