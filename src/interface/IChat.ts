import { Types, Document } from 'mongoose';
export interface IChat {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
  messageType: string;
  isNotSeen: string[];
  isDeleted: boolean;
}
interface IChatDocument extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
  messageType: string;
  isNotSeen: Types.ObjectId[];
  isDeleted: boolean;
}

export interface IChatResponse extends IChatDocument {
  _id: Types.ObjectId | string;
}
