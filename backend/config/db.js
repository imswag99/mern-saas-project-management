import mongoose from "mongoose";

export const dbConn = async() => {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("DB connected successfully.");
    })
}