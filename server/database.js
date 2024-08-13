import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const connection = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB." + __dirname);
    } catch (error) {
        console.log("Connection to MongoDB failed. \n\t Error:", error);
    }
}

export default connection;