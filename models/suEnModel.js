
import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    arrivalTime:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true,
    },
    dailyGoal :{
        type:String,
        require:true,
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},{timestamps:true});

export default mongoose.model("Enter",userSchema)