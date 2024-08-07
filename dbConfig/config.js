import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config();
const dbConnect = ()=>{
    try {
        const conn = mongoose.connect(process.env.MONGODB_URI,{
        })
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database:",error);
        return resizeBy.status(201).json({error})
    }
};
export default dbConnect;