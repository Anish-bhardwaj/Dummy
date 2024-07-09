const express= require('express');
//const app= express();
const cors=require('cors');
const connectDb=require('./config/connectDB');
const {app,server}=require('./socket/index')

const router=require('./routes/route');
require('dotenv').config();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
const port=process.env.PORT||4000;
app.get(('/'),(req,res)=>{
    res.send(`hello world`);
})


const cookieParser=require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1",router);
connectDb();
server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});