import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    weeklyGoal:{
        type:String,
        required:false
    },
   
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

},{timestamps:true})

export default mongoose.model('WeeklyGoal',userSchema)