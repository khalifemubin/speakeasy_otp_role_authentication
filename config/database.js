import mongoose from "mongoose";
import dotenv from "dotenv";

//Use env entry for Mongo DB connection
dotenv.config();

// Connect to MongoDB
export const dbConnection = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

dbConnection().catch((err) => console.error(err))