"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConversationModel2_1 = __importDefault(require("../database/ConversationModel2"));
const MessageModel2_1 = __importDefault(require("../database/MessageModel2"));
const propertyModel_1 = __importDefault(require("../database/propertyModel"));
const userModel_1 = require("../database/userModel");
const socketIo_1 = require("../utils/socketIo");
class ChatRepository {
    async sendMessage(message, senderId, receiverId) {
        try {
            let conversation = await ConversationModel2_1.default.findOne({
                participants: { $all: [senderId, receiverId] }
            });
            if (!conversation) {
                conversation = await ConversationModel2_1.default.create({
                    participants: [senderId, receiverId]
                });
            }
            const newMessage = new MessageModel2_1.default({
                senderId,
                receiverId,
                message
            });
            await newMessage.save();
            if (newMessage) {
                conversation.messages.push(newMessage._id);
            }
            await Promise.all([conversation.save(), newMessage.save()]);
            const receiverSocketId = (0, socketIo_1.getReceiverSocketId)(receiverId);
            if (receiverSocketId) {
                // io.to(<socket_Id>).emit() is used to send events to specific clients
                socketIo_1.io.to(receiverSocketId).emit('newMessage', newMessage);
            }
            return newMessage;
        }
        catch (error) {
            console.log('send message error in user repository ');
        }
    }
    async getMessages(userToChatId, senderId) {
        try {
            if (senderId && userToChatId) {
                console.log('chat id :', userToChatId);
                console.log('chat id :', senderId);
                let conversation = await ConversationModel2_1.default.findOne({
                    participants: { $all: [senderId, userToChatId] },
                }).populate("messages");
                if (!conversation)
                    return [];
                const messages = conversation.messages;
                console.log('rest as;l====>', messages);
                return messages;
            }
        }
        catch (error) {
            console.log("Error in getMessages controller: ", error);
            return { error: "Internal server error" };
        }
    }
    async getUsersForSidebar(loggedInUserId) {
        try {
            const users = await userModel_1.UserModel.find({ _id: { $ne: loggedInUserId } });
            const properties = await propertyModel_1.default.find({ _id: { $ne: loggedInUserId } });
            const filteredUsers = [...users, ...properties];
            return filteredUsers;
        }
        catch (error) {
            console.error("Error in getUsersForSidebar: ", error);
            return { error: "Internal server error" };
        }
    }
}
exports.default = ChatRepository;
