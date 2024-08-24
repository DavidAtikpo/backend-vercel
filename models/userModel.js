import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
firstName :{
  type:String,
  require:true,
},
lastName:{
  type:String,
  require:true,
},
email:{
  type:String,
  require:true,
},

  phoneNumber:{
    type:String,
    required:true
  },

password:{
  type:String,
  require:true,
},
isVerified:{
  type:Boolean,
  default:false,
},
profilePhotoURL: {
  type: String, 
  default: '/default-user-profile-svgrepo-com (1).svg' // URL par défaut si l'utilisateur n'a pas de photo de profil
},
role:{
  type:String,
  default:'',
},
refreshToken:{
  type:String,
  require:true,
},
verificationToken:{
  type:String,
  require:true
},
passwordChangeAt:Date,
passwordResetToken:String,
passwordResetExpires:Date,

},{timestamps:true})

userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt)
  
  // this.confirmPassword = await bcrypt.hash(this.confirmPassword, salt)
});
userSchema.methods.isPasswordMatched = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
};
userSchema.methods.createPasswordResetToken= async function() {
  const resettoken =crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resettoken).digest("hex");
  this.passwordResetExpires = Date.now() + 30*60*1000; //10 minutes
  return resettoken
}

export default mongoose.model("User", userSchema)