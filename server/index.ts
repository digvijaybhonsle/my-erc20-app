import { config } from "./src/config";
import express from "express";
import { connectDB } from "./src/db";
import routes from "./src/routes";
import { rateLimiter } from "./src/middleware/rateLimit";
import { errorHandler } from "./src/middleware/errorHandler";
import walletRoutes from "./src/routes/wallet";
import tradesRoutes from "./src/routes/trades";

async function startServer() {
    try {
        await connectDB();
        console.log("✅ Connected to MongoDB");

        const app = express();

        // Middleware
        app.use(express.json());
        app.use(rateLimiter);

        // Routes
        app.use("/api/wallet", walletRoutes);
        app.use("/api/wallet", tradesRoutes);      // GET /api/wallet/:address/trades

        // Default route
        app.get("/", (req, res) => {
            res.send("API is running 🚀");
        });

        // Error handling middleware
        app.use(errorHandler);

        // Start server
        app.listen(config.PORT, () => {
            console.log(`Server is running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); // Exit process with failure code
    }
}

startServer();
