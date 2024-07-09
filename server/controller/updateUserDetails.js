const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const User = require("../model/UserModel");

async function updateUserDetails(req,res){
    try{
        const token=req.cookies.token ||" ";
        const user=await getUserDetailsFromToken(token);
        const {name, profilePic}=req.body;
        const updateUser= await User.updateOne({_id:user._id},{
            name,profilePic
        });
        const userInformation=await User.findById(user._id).select('-password');

        res.status(200).json({
            message:"User Updated Succesfully",
            data: userInformation,
            success:true
        });
    }catch(err){
        res.status(500).json({message:"Something went wrong while updating",data:err.message});
    }
}
module.exports=updateUserDetails;