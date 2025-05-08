import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    address: string;
    nonce: string;
    createdAt: Date;
  }

const UserSchema = new Schema<IUser>({
    address: { type: String, required: true, unique: true },
    nonce: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
});

export const User = model<IUser>("User", UserSchema);


  
