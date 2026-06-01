import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const instance = await mongoose.connect(process.env.DATABASE_URL)
    } catch (error) {
        
    }  
};

export default connectDB;