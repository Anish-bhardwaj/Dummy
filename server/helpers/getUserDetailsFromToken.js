const jwt=require('jsonwebtoken');
const User = require('../model/UserModel');
async function getUserDetailsFromToken(token){
    
    if(!token){
        return {
            message:"Session Out",
            logout:true
        }
    }
    try{
    const decode= jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decode.id).select('-password');
    return user;
    }
    catch(err){
        return "Error occurees in verify";
    }

}
module.exports=getUserDetailsFromToken;