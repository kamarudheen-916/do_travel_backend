import mongoose,{Schema} from "mongoose";
import IConversation from "../../domain_entities/Chat/Conversation";



const conversationSchema:Schema<IConversation>  = new Schema(
    {
		participants: [
			{
				type: String,
				ref: "User",
			},
		],
		messages: [
			{
				type: String,
				ref: "MessageModel",
				default: [],
			},
		],
	},
	{ timestamps: true }
)

const ConversationModel = mongoose.model<IConversation>('ConversationModel',conversationSchema)
export  default ConversationModel