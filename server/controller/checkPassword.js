const User = require("../model/UserModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function checkPassword(req,res){
    const {password, userId}=req.body;
    try{

        const user=await User.findById(userId);
        if(!user){
            return res.status(500).json({
                message:"User ID is invalid",
                
            });
        }
        
            if(await bcrypt.compare(password,user.password)){
                const tokenData={
                    id:user._id,
                    email:user.email
                }
                const token=await jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'1d'});
                const cookieOption={
                    expires:new Date(Date.now()+1000*60*60*24),
                    httpOnly:true,
                    secure:true
                }
                return res.cookie('token',token,cookieOption).status(200).json({
                    message:"Login succesfully",
                    token:token,
                    success:true
                });
            }else{
                return res.status(400).json({
                    message:"User password is invalid",
                    success:false
                });
            }
        
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong while verifying the password",
            data:err
        });
    }
}
module.exports=checkPassword;