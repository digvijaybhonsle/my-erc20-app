import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dashboardRoutes from "./src/routes/dashboard";
import walletRoutes from "./src/routes/wallet";
import tokenRoutes from "./src/routes/token";
import tradeRoutes from "./src/routes/trades";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Add your deployed Vercel frontend URL here
const allowedOrigins = [
  "http://localhost:5173", 
  "https://my-erc20-app.vercel.app/" 
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "Server is running" });
});

// API Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/trade", tradeRoutes);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.DB_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log("✅ MongoDB connection successful");
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
  });
