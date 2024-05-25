import mongoose,{Schema} from "mongoose";
import IMessage from "../../domain_entities/Chat/MessageInteface";



const MessageSchema:Schema<IMessage>  = new Schema(
	{
		senderId: {
			type: String,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: String,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
)

const MessageModel = mongoose.model<IMessage>('MessageModel',MessageSchema)
export  default MessageModel