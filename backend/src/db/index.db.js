import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const instance = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`  MongoDB Connected! DB Host: ${instance.connection.host}`);
        console.log(`  Database Name: ${instance.connection.name}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }  
};

export default connectDB;