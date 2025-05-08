import { User, IUser } from "../db/models/User";
import { Transaction, ITransaction } from "../db/models/Transaction";
import { randomUUID } from "crypto";

class DBService{
    /** Create or update a user with a new nonce (for signature auth) */
  async upsertUserNonce(address: string): Promise<string> {
    const nonce = randomUUID();
    const user = await User.findOneAndUpdate(
      { address },
      { address, nonce },
      { upsert: true, new: true }
    );
    return user.nonce;
}

//get user by address
async getUserByAddress(address: string): Promise<IUser | null> {
    return User.findOne({ address }).exec();
  }

/** Log an on‑chain transaction */
async logTransaction(tx: {
    txHash: string;
    from: string;
    to: string;
    amount: string;
  }): Promise<ITransaction> {
    return Transaction.create({
      txHash: tx.txHash,
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
    });
  }

/** Fetch recent transactions for an address */
async getTransactionsByAddress(address: string): Promise<ITransaction[]> {
    return Transaction.find({
      $or: [{ from: address }, { to: address }],
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
  }
}

export const dbService = new DBService();