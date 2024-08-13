import mongoose from "mongoose";

const connection = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");       // Connected to MongoDB./var/task/server
    } catch (error) {
        console.log("Connection to MongoDB failed. \n\t Error:", error);
    }
}

export default connection;