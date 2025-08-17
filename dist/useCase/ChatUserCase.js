"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatUserCase {
    constructor(IChatRepo) {
        this.IChatRepo = IChatRepo;
    }
    async sendMessage(message, senderId, receiverId) {
        try {
            const res = await this.IChatRepo.sendMessage(message, senderId, receiverId);
            return res;
        }
        catch (error) {
            console.log('sendMessage error in userUseCase:', error);
            throw error;
        }
    }
    async getMessages(userToChatId, senderId) {
        try {
            const res = await this.IChatRepo.getMessages(userToChatId, senderId);
            return res;
        }
        catch (error) {
            console.log('getMessages error in userUsercase', error);
            throw error;
        }
    }
    async getUsersForSidebar(loggedInUserId) {
        try {
            console.log('userid ***>', loggedInUserId);
            const res = await this.IChatRepo.getUsersForSidebar(loggedInUserId);
            return res;
        }
        catch (error) {
            console.log('getMessages error in userUseCase:', error);
            throw error;
        }
    }
}
exports.default = ChatUserCase;
