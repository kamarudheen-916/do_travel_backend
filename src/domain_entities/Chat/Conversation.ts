import { Document, Schema } from 'mongoose';

interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default IConversation;
