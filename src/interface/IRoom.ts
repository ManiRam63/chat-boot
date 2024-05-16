import mongoose from 'mongoose';

export interface IRoom {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    roomType?: string;
    createdBy?: mongoose.Types.ObjectId;
    isDeleted?: boolean;
    error?: string;
    metaData?: IMetaData;
    userId?: mongoose.Types.ObjectId;
    roomId?: mongoose.Types.ObjectId;
}

export interface IMetaData {
    totalRecords?: number;
    currentPage?: number;
    recordPerPage?: number;
}
export interface IUserQuery extends Request {
    query?: IRoom;
}
