import { config } from "./src/config";
import express from "express";
import { connectDB } from "./src/db";
import routes from "./src/routes";
import { rateLimiter } from "./src/middleware/rateLimit";
import { errorHandler } from "./src/middleware/errorHandler";

async function startServer() {
    await connectDB(); // Connect to MongoDB
    const app = express();

    app.use(rateLimiter);
    app.use(express.json());
    app.use("/api", routes);
    app.use(errorHandler);
    
    app.get("/", (req, res) => {
        res.send("API is running 🚀");
      });
    console.log("✅ Connected to MongoDB");


    app.listen(config.PORT, () => {
        console.log(`Server is running on port ${config.PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1); 
});

