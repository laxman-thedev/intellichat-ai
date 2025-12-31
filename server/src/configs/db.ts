import mongoose from "mongoose";

/**
 * Connects the application to MongoDB using Mongoose
 * - Reads connection string from environment variables
 * - Attaches connection event listeners
 * - Exits process if connection fails
 */
const connectDB = async (): Promise<void> => {
    try {
        // Read MongoDB connection URI from environment
        const mongoUri = process.env.MONGODB_URI;

        // Fail fast if URI is missing
        if (!mongoUri) {
            throw new Error("MONGODB_URI not found in environment variables");
        }

        // Log successful connection
        mongoose.connection.on("connected", () => {
            console.log("Database connected");
        });

        // Connect to MongoDB and use `intellichat` database
        await mongoose.connect(`${mongoUri}/intellichat`);
    } catch (error) {
        // Log error and terminate process if DB connection fails
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default connectDB;