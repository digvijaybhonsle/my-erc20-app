import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RPC_URL) {
  throw new Error("RPC_URL is not set in environment variables");
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export default provider;
