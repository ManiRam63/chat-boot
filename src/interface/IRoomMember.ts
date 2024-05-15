import mongoose from 'mongoose';
import { IMetaData } from './IRoom';

export interface IRoomMember {
  userId?: mongoose.Types.ObjectId;
  username?: string;
  _id?: mongoose.Types.ObjectId;
  name?: string;
  roomType?: string;
  createdBy?: mongoose.Types.ObjectId;
  // isDeleted?: boolean;
  error?: string;
  metaData?: IMetaData;
  roomId?: mongoose.Types.ObjectId;
}
