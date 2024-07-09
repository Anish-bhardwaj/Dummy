const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

const express= require('express');
const {Server}=require('socket.io');
const http=require('http');
const User = require("../model/UserModel");
const { Conversation, Message } = require("../model/ConversationModel");
const getConversation = require("../helpers/getConversation");
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL|| 'http://localhost:3000',
        credentials:true
    }
});
//online user
const onlineUser=new Set();
io.on('connection',async (socket)=>{
    console.log("Connect user ",socket.id)
    const token=socket.handshake.auth.token
   

    //current user details
    const user=await getUserDetailsFromToken(token);
    
    //Create a room
    socket.join(user?._id?.toString());

    onlineUser.add(user?._id?.toString());
    io.emit('onlineUser',Array.from(onlineUser))


    socket.on('message-page',async(userId)=>{
        console.log("UserId",userId);
        const userDetails=await User.findById(userId).select('-password');
        const payload={
            _id: userDetails?._id,
            name:userDetails?.name,
            email:userDetails?.email,
            online:onlineUser.has(userId),
            profilePic:userDetails?.profilePic
        }
        socket.emit('message-page',payload);

        // Get previous messages
        let getConversationMessage= await Conversation.findOne({
            "$or":[
                {sender:user?._id, receiver:userId},
                {sender:userId, receiver:user?._id}
            ]
        }).populate('messages').sort({updatedAt:-1})
        if(getConversationMessage){

            socket.emit('message',getConversationMessage?.messages || [])
        }
        
    })


    //new Message
    socket.on('new message',async (data)=>{
        //Check whether conversation is available or not between sender and receiver
        let conversation= await Conversation.findOne({
            "$or":[
                {sender:data?.sender, receiver:data?.receiver},
                {sender:data?.receiver, receiver:data?.sender}
            ]
        })
        console.log("Conversation",conversation)
        // If conversation is not available 
        if(!conversation){
            const createConversation =await Conversation({
                sender:data?.sender,
                receiver:data?.receiver
            })
            conversation=await createConversation.save();
        }
        const message= new Message({
            
        text:data?.text,
        imageUrl:data?.imageUrl,
        videoUrl:data?.videoUrl,
        msgByUserId:data?.msgByUserId
        
        });
        const saveMessage=await message.save();
        const updateConversation = await Conversation.findByIdAndUpdate(
            conversation._id,
            { "$push": { messages: saveMessage._id } },
            { new: true } // This option returns the modified document
          );
          let getConversationMessage= await Conversation.findOne({
            "$or":[
                {sender:data?.sender, receiver:data?.receiver},
                {sender:data?.receiver, receiver:data?.sender}
            ]
        }).populate('messages').sort({updatedAt:-1})
        io.to(data?.sender).emit('message',getConversationMessage?.messages ||[]);
        io.to(data?.receiver).emit('message',getConversationMessage?.messages ||[]);
            //send conversation
            const conversationSender= await getConversation(data?.sender);
            const conversationReceiver= await getConversation(data?.receiver);
            io.to(data?.sender).emit('conversation',conversationSender ||[]);
        io.to(data?.receiver).emit('conversation',conversationReceiver ||[]);
    })

    //Side bar 
    socket.on('sidebar',async(currentUserId)=>{
        if (!currentUserId) {
            
            return [];
        }

        console.log(
            "currentUserId in sidebar",currentUserId
        )
        const conversation= await getConversation(currentUserId);
        socket.emit('conversation',conversation)
    })

    socket.on('seen',async(msgByUserId)=>{
        if (user?._id?.toString() === msgByUserId) {
            return;
        }
        let conversation= await Conversation.findOne({
            "$or":[
                {sender:user?._id, receiver:msgByUserId},
                {sender:msgByUserId, receiver:user?._id}
            ]
        })
        const conversationMessageId=conversation?.messages ||[];
        const updateMessages= await Message.updateMany(
            {_id:{"$in":conversationMessageId}, msgByUserId:msgByUserId},
            {"$set":{seen:true}}
        )
        //send conversation
        const conversationSender= await getConversation(user?._id?.toString());
        const conversationReceiver= await getConversation(msgByUserId);
        io.to(user?._id?.toString()).emit('conversation',conversationSender ||[]);
    io.to(msgByUserId).emit('conversation',conversationReceiver ||[]);

    })
    //Disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id?.toString());
        console.log("Disconnect user ",socket.id)
    })
})
module.exports={
    app, server
}