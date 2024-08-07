import post from "../models/postModel.js";


const workSpace = async(req,res)=>{
try {
    const {id}= req.user
    const Post = req.body;
    const findUser = await post.find(id);
    

} catch (error) {
    
}
}