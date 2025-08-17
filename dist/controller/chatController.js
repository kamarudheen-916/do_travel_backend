"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatController {
    constructor(chatUserCase) {
        this.chatUserCase = chatUserCase;
    }
    async sendMessage(req, res) {
        try {
            const message = req.body.message;
            const senderId = req.userId;
            const receiverId = req.params.id;
            const resp = await this.chatUserCase.sendMessage(message, senderId, receiverId);
            res.status(201).json(resp);
        }
        catch (error) {
            console.log("Error in sentMessages controller: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    async getMessages(req, res) {
        try {
            const { id: userToChatId } = req.params;
            const senderId = req.userId;
            const resp = await this.chatUserCase.getMessages(userToChatId, senderId);
            res.status(201).json(resp);
        }
        catch (error) {
            console.log("Error in getMessages controller: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    async getUsersForSidebar(req, res) {
        try {
            const loggedInUserId = req.userId;
            const resp = await this.chatUserCase.getUsersForSidebar(loggedInUserId);
            res.status(201).json(resp);
        }
        catch (error) {
            console.error("Error in getUsersForSidebar: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.default = ChatController;
