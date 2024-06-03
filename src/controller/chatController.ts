import { Request, Response } from "express";
import ChatUserCase from "../useCase/ChatUserCase";

class ChatController {
    constructor(
         private readonly chatUserCase : ChatUserCase
    ){}

    async sendMessage (req:Request,res:Response){
        try {
            const message = req.body.message
            const senderId = req.userId
            const receiverId = req.params.id
            const resp = await this.chatUserCase.sendMessage(message,senderId,receiverId)
                res.status(201).json(resp);
        } catch (error) {
            console.log("Error in sentMessages controller: ", error);
		res.status(500).json({ error: "Internal server error" });
            
        }
    }

    async getMessages (req:Request,res:Response){
        try {
            const { id: userToChatId } = req.params;
		    const senderId = req.userId;
            const resp = await this.chatUserCase.getMessages(userToChatId,senderId)
            res.status(201).json(resp)
        } catch (error) {
            console.log("Error in getMessages controller: ", error);
            res.status(500).json({ error: "Internal server error" }); 
        }
    }

    async getUsersForSidebar(req:Request,res:Response){
        try {
            const loggedInUserId = req.userId
            const resp = await this.chatUserCase.getUsersForSidebar(loggedInUserId)
            res.status(201).json(resp)
        } catch (error) {
            console.error("Error in getUsersForSidebar: ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default ChatController