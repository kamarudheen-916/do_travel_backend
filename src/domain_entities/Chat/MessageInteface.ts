import { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IMessage;
