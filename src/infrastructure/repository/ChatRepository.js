"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    sendMessage(message, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let conversation = yield ConversationModel2_1.default.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                if (!conversation) {
                    conversation = yield ConversationModel2_1.default.create({
                        participants: [senderId, receiverId]
                    });
                }
                const newMessage = new MessageModel2_1.default({
                    senderId,
                    receiverId,
                    message
                });
                yield newMessage.save();
                if (newMessage) {
                    conversation.messages.push(newMessage._id);
                }
                yield Promise.all([conversation.save(), newMessage.save()]);
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
        });
    }
    getMessages(userToChatId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (senderId && userToChatId) {
                    console.log('chat id :', userToChatId);
                    console.log('chat id :', senderId);
                    let conversation = yield ConversationModel2_1.default.findOne({
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
        });
    }
    getUsersForSidebar(loggedInUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.UserModel.find({ _id: { $ne: loggedInUserId } });
                const properties = yield propertyModel_1.default.find({ _id: { $ne: loggedInUserId } });
                const filteredUsers = [...users, ...properties];
                return filteredUsers;
            }
            catch (error) {
                console.error("Error in getUsersForSidebar: ", error);
                return { error: "Internal server error" };
            }
        });
    }
}
exports.default = ChatRepository;
