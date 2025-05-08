import { Schema, model, Document, Types } from 'mongoose';

interface IMessage {
  id: string;
  text: string;
  fromBot: boolean;
  timestamp: Date;
}

export interface IChat extends Document {
  sessionId: string;
  userId: Types.ObjectId;
  messages: IMessage[];
  role: string;
}

const MessageSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  fromBot: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [MessageSchema],
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IChat>('Chat', ChatSchema);