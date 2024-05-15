import UserModel from '../../model/user.model';
import bcrypt from 'bcrypt';
import { ResponseMessage } from '../../utils/responseMessage';
import { IUser, IUserRestPasswordRequest, IUserRestPasswordResponse, UserData, UserResult } from '../../interface/IUser';
import { IMetaData } from '../../interface/IRoom';
import mongoose, { QueryOptions } from 'mongoose';
const responseMessage = ResponseMessage.USER;
const salt: string = bcrypt.genSaltSync(16);
/**
 * @description: This function is used to create new user
 * @param : user data object
 * @returns : user response with data records
 */
const UserService = {
  create: async (data: UserData): Promise<{ result?: IUser; error?: string }> => {

    const { password } = data;
    if (password && typeof password === 'string') {
      data.password = bcrypt.hashSync(password, salt);
    }
    const user = new UserModel(data);
    let result: IUser = await user.save();
    result = await UserModel.findOne({ _id: result?._id }).lean();
    return result;
  },

  /**
   * @description: This function is used to find user via id
   * @param : _id
   * @returns : user response with data records
   */
  findById: async (id: mongoose.Types.ObjectId): Promise<IUser> => {
    try {
      const user: IUser = await UserModel.findOne({ _id: id }).lean();
      return user;
    } catch (error) {
      return error;
    }
  },
  /**
   * @description: This function is used to find user via attributes
   * @param : _id
   * @returns : user response with data records
   */
  findByAttribute: async (attributes: IUser): Promise<IUser> => {
    try {
      const user: IUser = await UserModel.findOne(attributes, {
        password: 1
      }).lean();
      return user;
    } catch (error) {
      return error;
    }
  },
  /**
   * @description: This function is used to update user
   * @param : dataObject
   * @returns : user response with data records
   */
  updateUser: async (
    id: mongoose.Types.ObjectId,
    requestObj: IUser
  ): Promise<{ error?: string; result?: IUser }> => {
    try {
      const updatedUser: IUser = await UserModel.findOneAndUpdate(
        { _id: id },
        requestObj,
        { new: true }
      ).lean();
      if (!updatedUser) {
        return { error: responseMessage.USER_NOT_FOUND };
      }
      return updatedUser;
    } catch (error) {
      return {
        error: error?.message || responseMessage.SOME_ERROR_OCCURRED
      };
    }
  },
  /**
   * @description: This function is delete user
   * @param : user id
   * @returns : Success and Error Message
   */
  deleteUser: async (id: mongoose.Types.ObjectId): Promise<{ message?: string, error?: string }> => {

    try {
      const data = await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          isDeleted: true
        }
      ).lean();
      if (!data) {
        return { error: responseMessage.SOME_ERROR_OCCURRED }
      }
      return { message: responseMessage.USER_DELETED_SUCCESSFULLY }
    } catch (error) {
      return { error: error?.message }
    }

  },
  /**
   * @description: This function is list of all users
   * @param : query params
   * @returns : Success and Error Message
   */
  list: async (
    body: QueryOptions
  ): Promise<{ users?: UserResult; metaData?: IMetaData; error?: string }> => {
    const { limit = 10, sort, page = 1, search = '', order } = body;
    const offset = limit * (page - 1) || 0;
    try {
      const sortObj = {};
      const orderNum = order === 'asc' ? 1 : -1;
      if (sort) {
        sortObj[sort] = +orderNum;
      } else {
        sortObj['username'] = 1;
      }

      const match = [];
      let searchVal = '';
      if (search) {
        searchVal = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      match.push({
        $or: [
          { username: { $regex: searchVal, $options: 'i' } },
          { email: { $regex: searchVal, $options: 'i' } },
          { firstname: { $regex: searchVal, $options: 'i' } },
          { lastname: { $regex: searchVal, $options: 'i' } }
        ]
      });

      const where = { $and: match };
      const dataCond = [
        { $sort: sortObj },
        { $skip: Number(offset) },
        { $limit: Number(limit) }
      ];
      const aggregation = [
        { $match: where },
        { $project: { password: 0 } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: dataCond
          }
        }
      ];

      const usersList = await UserModel.aggregate(aggregation, {
        collation: { locale: 'en' }
      });
      const metaData = {
        totalRecords: usersList[0]?.metadata[0]?.total || 0,
        currentPage: page,
        recordPerPage: limit
      };
      const users = usersList.length ? usersList[0].data : [];
      return { users, metaData };
    } catch (e) {
      return { error: e?.message }
    }
  },
  /**
   * @description: this function is used to reset password via sending with old password 
   * @param body 
   * @returns success response and error 
   */
  resetPassword: async (body: IUserRestPasswordRequest): Promise<IUserRestPasswordResponse> => {
    try {
      const data: IUser = {};
      const { email, newPassword } = body
      if (newPassword && typeof newPassword === 'string') {
        data.password = bcrypt.hashSync(newPassword, salt);
      }
      await UserModel.findOneAndUpdate({ email: email }, {
        $set: {
          password: data.password
        }
      })
      return {
        message: ResponseMessage.USER.PASSWORD_UPDATED_SUCCESSFULLY
      }
    } catch (error) {
      return error
    }
  }
};
export default UserService;
