const { Conversation, Message } = require("../model/ConversationModel");
const getConversation=async (currentUserId)=>{
    const currentUserConversations=await Conversation.find({
        "$or":[
            {sender:currentUserId},
            {receiver: currentUserId}
        ]
    }).sort({updatedAt:-1}).populate('messages').populate('receiver').populate('sender');
    
    const conversation=currentUserConversations.map((conv)=>{
        const countUnseenMsg= conv.messages.reduce((prev,curr) =>{
            if(curr?.mesByUserId?.toString()!== currentUserId){

                return prev+ (curr.seen?0:1)
            }else{
                return prev;
            }
        },0)
        return{
            _id:conv?._id,
            sender:conv?.sender,
            receiver:conv?.receiver,
            unseenMsg:countUnseenMsg,
            lastMsg: conv?.messages[conv?.messages?.length-1]
            
        }
    })
    return conversation;
    
}
module.exports= getConversation;