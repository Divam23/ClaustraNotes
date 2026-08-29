import {app} from "./app";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.config";

configDotenv();

const PORT = process.env.PORT || 1500;

const startServer = async()=>{
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

