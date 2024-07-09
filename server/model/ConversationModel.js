const mongoose=require('mongoose');

const conversationSchema =new mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    messages:[{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'Message'
    }]

},{
    timestamps:true
});
const messageSchema=new mongoose.Schema({
    text:{
        type:String,
        default:""
    },
    imageUrl:{
        type:String,
        default:""
    },
    videoUrl:{
        type:String,
        default:""
    },
    seen:{
        type:Boolean,
        default:false
    },
    msgByUserId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    }


},{
    timestamps:true
});
const Conversation=mongoose.model("Conversation",conversationSchema);
const Message=mongoose.model('Message',messageSchema);
module.exports={Conversation,Message};