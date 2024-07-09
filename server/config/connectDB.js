const mongoose=require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected succesfully");
    }
    catch(err){
        console.log("Something went wrong with Database connection",err);
    }
}
module.exports=connectDB;