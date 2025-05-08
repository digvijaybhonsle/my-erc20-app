import { config } from '../config';
import { ethers } from 'ethers';
import * as deployment from '../../../deployments/sepolia.json;

interface ContractInstance {
    address: string;
    abi: any;
}

/**
 * EthereumService
 * - Initializes provider & signer
 * - Loads deployed contract instance
 * - Provides helper methods for balance, transfers, etc.
 */
class EthereumService {
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;
    private contract: ethers.Contract;
  
    constructor() {
      // 1. Provider
      this.provider = new ethers.JsonRpcProvider(config.SEPOLIA_URL);
  
      // 2. Signer (the server’s wallet for sending txs)
      this.signer = new ethers.Wallet(config.PRIVATE_KEY, this.provider);
  
      // 3. Contract instance
      const { address, abi } = deployment as ContractInstance;
      this.contract = new ethers.Contract(address, abi, this.signer);
    }
  
    /** Get ETH balance of any address */
    async getEthBalance(address: string): Promise<string> {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    }
  
    /** Get token balance (assumes ERC-20 `balanceOf`) */
    async getTokenBalance(address: string): Promise<string> {
      const balance = await this.contract.balanceOf(address);
      // assumes token has 18 decimals
      return ethers.formatUnits(balance, 18);
    }
  
    /**
     * Transfer tokens from server wallet to a recipient
     * @param to   recipient address
     * @param amt  amount in tokens (e.g. "10.5")
     */
    async transferTokens(to: string, amt: string): Promise<string> {
      const wei = ethers.parseUnits(amt, 18);
      const tx = await this.contract.transfer(to, wei);
      await tx.wait();  // wait for mining
      return tx.hash;
    }
  
    /**
     * Send raw ETH from server wallet
     */
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