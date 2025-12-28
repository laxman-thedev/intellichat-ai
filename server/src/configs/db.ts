import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI not found in environment variables");
        }

        mongoose.connection.on("connected", () => {
            console.log("Database connected");
        });

        await mongoose.connect(`${mongoUri}/intellichat`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default connectDB;