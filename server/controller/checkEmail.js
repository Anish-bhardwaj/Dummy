const User = require("../model/UserModel");

async function checkEmail(req,res){
const {email}=req.body;
    try{
        const user=await User.findOne({email}).select("-password");//to remove password form data
        if(!user){
            return res.status(400).json({
                message:"User does Not exist"
            });
        }
        return res.status(200).json({
            message:"Email is valid",
            data:user,
            success:true
        });
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong while verifying email",
            data:err
        });
    }
}
module.exports=checkEmail;