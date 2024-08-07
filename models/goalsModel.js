import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    sunday:{
        type:String,
        default:"jour de repos"
    },
   
    monday:{
        type:String,
        default:'jour de repos'
    },
    tuesday:{
        type:String,
        required:false
    },
    wednesday:{
        type:String,
        required:false
    },
    thursday:{
         type:String,
         required:false,
    },
    friday:{
        type:String,
        required:false,
    },
    saturday:{
        type:String,
        required:false,
    },
   
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }


},{timestamps:true})

export default mongoose.model('Goals',userSchema)