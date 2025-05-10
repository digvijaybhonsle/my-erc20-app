import mongoose, { Document, Schema } from "mongoose";

// Define the Trade interface extending mongoose.Document
export interface ITrade extends Document {
  walletAddress: string;
  action: 'swap' | 'receive' | 'send';
  details: string;
  amount: string;
  tokenSymbol: string;
  txHash: string;
  timestamp: Date;
}

// Create the Trade schema
const TradeSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, index: true },
  action: { type: String, enum: ['swap', 'receive', 'send'], required: true },
  details: { type: String, required: true },
  amount: { type: String, required: true },
  tokenSymbol: { type: String, required: true },
  txHash: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
});

// Create and export the model
const TradeModel = mongoose.model<ITrade>('Trade', TradeSchema);
export default TradeModel;
