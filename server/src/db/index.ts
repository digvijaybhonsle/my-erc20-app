import mongoose from "mongoose";
import { config } from "../config";

export  async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(config.DB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); 
    }
}
