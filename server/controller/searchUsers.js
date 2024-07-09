const User = require("../model/UserModel");

async function searchUsers(req,res){
    try{
        const {search} =req.body;
        const query=new RegExp(search,"i");
        const user= await User.find({
            "$or":[
                {"name":query},
                {"email":query}
            ]
        }).select('-password');
        res.status(200).json({
            message:"All users",
            success:true,
            data:user
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message,
            error:true
        });
    }
}
module.exports=searchUsers;