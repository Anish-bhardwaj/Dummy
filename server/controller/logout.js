async function logout(req,res){
    try{
        const cookieOption={
            expires:new Date(Date.now()+1000*60*60*24),
            httpOnly:true,
            secure:true
        }
        return res.cookie('token','',cookieOption).status(200).json({
            message:"Logged out succesfully",
        
            success:true
        });
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong while logging out the user details",
            data:err

        });
    }

}
module.exports=logout;
