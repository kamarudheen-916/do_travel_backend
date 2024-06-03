interface IChatRepository{
    sendMessage(message:string,senderId:string,receiverId:string):Promise<any>
    getMessages(userToChatId:string,senderId:string):Promise<any>
    getUsersForSidebar(loggedInUserId:string):Promise<any>
}

export default IChatRepository