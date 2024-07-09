const User=require('../model/UserModel');
const bcrypt=require('bcrypt');
async function registerUser(req,res){
    try{
        const {name,email,password,profilePic}= req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }

        catch(err){
            return res.status(400).json({message:"Something went wrong while hashing the password"});        
        }
        const payload={
            name,email,profilePic,password:hashedPassword
        }
        const newUser=new User(payload);
        const userSave=await newUser.save();
        return res.status(200).json({
            message:"User created successfully",
            data:userSave,
            success:true
        })

    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong",
            data: error.message,
        })
    }
}module.exports=registerUser;