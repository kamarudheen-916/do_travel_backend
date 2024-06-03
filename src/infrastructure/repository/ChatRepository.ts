import IChatRepository from "../../useCase/interface/IChatRepository";
import ConversationModel from "../database/ConversationModel2";
import MessageModel from "../database/MessageModel2";
import PropertyModel from "../database/propertyModel";
import { UserModel } from "../database/userModel";
import { getReceiverSocketId, io } from "../utils/socketIo";

class ChatRepository implements IChatRepository {
    async sendMessage(message: string, senderId: string, receiverId: string): Promise<any> {
        try {
          let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
          });

          if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId]
            });
            }

                        const newMessage = new MessageModel({
                    senderId,
                    receiverId,
                    message
                    });

          if (newMessage) {
            conversation.messages.push(newMessage._id);
            }


            await Promise.all([conversation.save(), newMessage.save()]);

            const receiverSocketId = getReceiverSocketId(receiverId)
            if(receiverSocketId){
                // io.to(<socket_Id>).emit() is used to send events to specific clients
                io.to(receiverSocketId).emit('newMessage',newMessage)
            }
            return newMessage
        } catch (error) {
          console.log('send message error in user repository ');
          
        }
      }
      async getMessages(userToChatId: string, senderId: string): Promise<any> {
        try {
          if(senderId && userToChatId){
            console.log('chat id :',userToChatId);
            console.log('chat id :',senderId);
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return []

        const messages = conversation.messages;
        console.log('rest as;l====>',messages);
        return messages
        }

        } catch (error) {
           console.log("Error in getMessages controller: ", error);
            return { error: "Internal server error" }
            
        }
      } 
      async getUsersForSidebar(loggedInUserId:string): Promise<any> {
        try {
         const  users = await UserModel.find({ _id: { $ne: loggedInUserId } })
        const  properties = await PropertyModel.find({_id:{$ne:loggedInUserId}})
        const filteredUsers = [...users,...properties] 
        return filteredUsers
        } catch (error) {
          console.error("Error in getUsersForSidebar: ", error);
            return { error: "Internal server error" }
            
        }
      }
}

export default ChatRepository