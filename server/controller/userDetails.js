const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(req,res){
    try{
        const token=req.cookies.token ||" ";
        const user=await getUserDetailsFromToken(token);
        return res.status(200).json({
            message:"User Details",
            data:user

        });
    }
    catch(err){
        return res.status(500).json({
            message:"Something went wrong while fetching the user details",
            data:err

        });
    }
}
module.exports=userDetails;