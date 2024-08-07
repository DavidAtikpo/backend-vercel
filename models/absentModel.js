
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
    birthDate:{
         type:String,
         required:false,
    },
    birthPlace:{
        type:String,
        required:false,
    },
    sex:{
        type:String,
        required:false
    },
    class:{
        type:String,
        required:false,
    },
    school:{
        type:String,
        required:false
    },
    live:{
        type:String,
        required:false
    },
    fatherName:{
        type:String,
        required:false,
    },
    motherName:{
        type:String,
        required:false,
    },
    phoneNumber:{
       type:Number,
       required:false,
    },
    occupation:{
       type:String,
       required:false
    },
    dataOfEntry:{
        type:Date,
        required:false,
    },
    otherInfo:{
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