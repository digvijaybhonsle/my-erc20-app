import mongoose, { Document, Schema } from "mongoose";

// Define the ITrade interface
export interface ITrade extends Document {
  walletAddress: string;
  type: "Send" | "Receive" | "Swap";
  details: string;
  amount: string;
  tokenSymbol: string;
  txHash: string;
  timestamp: Date;
}

// Define the Trade schema
const TradeSchema: Schema<ITrade> = new Schema({
  walletAddress: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["Send", "Receive", "Swap"],
    required: true,
  },
  details: { type: String, required: true },
  amount: { type: String, required: true },
  tokenSymbol: { type: String, required: true },
  txHash: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

// Create and export the model
const TradeModel = mongoose.model<ITrade>("Trade", TradeSchema);
export default TradeModel;