import IChatRepository from "./interface/IChatRepository";

class ChatUserCase {
    constructor(
        private readonly IChatRepo : IChatRepository
    ){}
    async sendMessage(message:any,senderId:any,receiverId:any) {
        try {
           const res = await this.IChatRepo.sendMessage(message,senderId,receiverId)
           return res
        } catch (error) {
            console.log('sendMessage error in userUseCase:', error);
            throw error;
        }
    }
    
    async getMessages(userToChatId:any,senderId:any){
        try {
            const res = await this.IChatRepo.getMessages(userToChatId,senderId)
            return res
        } catch (error) {
            console.log('getMessages error in userUsercase',error);
            throw error
            
        }
    }
    
    async getUsersForSidebar(loggedInUserId:any) {
        try {
            console.log('userid ***>',loggedInUserId);
           const res = await this.IChatRepo.getUsersForSidebar(loggedInUserId)
           return res
        } catch (error) {
            console.log('getMessages error in userUseCase:', error);
            throw error;
        }
    }
}

export default ChatUserCase