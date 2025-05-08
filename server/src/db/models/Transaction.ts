import { Schema, Document, model } from "mongoose";

export interface ITransaction extends Document {
    txHash: string;
    from: string;
    to: string;
    amount: string;
    timestamp: Date;
}

const TranscationSchema = new Schema<ITransaction>({
    txHash: { type: String, required: true, unique: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
});

export const Transaction = model<ITransaction>("Transaction", TranscationSchema);