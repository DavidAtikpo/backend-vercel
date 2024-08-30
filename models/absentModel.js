
import  mongoose  from "mongoose"

const userSchema = new mongoose.Schema({
    childId:{
         type:String,
         required:true
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
   
    profileImageURL:{
          type:String,
          default:''
    },
    absentCount:{
         type:Number,
         default:0,
    },
    lastAbsentDate:{
          type:Date,
          default:Date.now

    },
    absentDates:[{
        type:Date,
    }],
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },


},{timestamps:true})

export default mongoose.model('Absent',userSchema)