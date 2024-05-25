import mongoose, {Schema} from "mongoose"
import { ChatUsersInterface } from "../../domain_entities/ChatUser"

const ChatUsers = new Schema<ChatUsersInterface>({
    chatUsetId:{type:String},
    chatUserType:{type:String},
    isOnline:{type:Boolean},
    chatUserProfile:{type:String},
})

const ChatUsersModel = mongoose.model<ChatUsersInterface>('chatusers',ChatUsers)
export default ChatUsersModel