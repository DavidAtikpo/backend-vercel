
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    justification:{
        type:String,
        required:true
    },
    choix:{
        type:String,
        require:true
    },
    pourcentage:{
       type:Number,
       required:true
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},{timestamps:true})
export default mongoose.model("Out", userSchema)