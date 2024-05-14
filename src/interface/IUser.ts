import { Request } from 'express';
import mongoose from 'mongoose';
export interface IUser {
  _id?: string;
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  isGuest?: boolean;
  status?: boolean;
  phone?: string;
  password?: string;
  isDeleted?: boolean;
  _doc?: object;
  error?: string;
  message?: string;
}
export interface IResponseUser {
  _doc?: IUser;
}
export interface UserResult {
  result: IUser;
  data?: IUser[];
  metaData?: {
    totalRecords: number;
    currentPage: number;
    recordPerPage: number;
  };
  error?: string;
}
export interface QueryOptions {
  limit?: number;
  sort?: string;
  page?: number;
  search?: string;
  order?: string;
  roomId?: string;
}

export interface UserData {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface UserRequest extends Request {
  user?: UserData;
}
export interface IUserLoginResponse extends IUser {
  token?: string;
}
export interface IUserSignInResponse extends IUser {
  result?: IUser;
}
export interface IUserResponse {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  isGuest?: boolean;
  status?: boolean;
  phone?: string;
  isDeleted?: boolean;
  error?: string;
  message?: string;
  _doc?: string;

}