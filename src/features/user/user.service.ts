import UserModel from '../../model/user.model';
import bcrypt from 'bcrypt';
import { ResponseMessage } from '../../utils/responseMessage';
import { IUser, UserData, UserResult } from '../../interface/IUser';
import { IMetaData } from '../../interface/IRoom';
import { QueryOptions } from 'mongoose';
const responseMessage = ResponseMessage.USER;
const salt: string = bcrypt.genSaltSync(16);
/**
 * @description: This function is used to create new user
 * @param : user data object
 * @returns : user response with data records
 */
const UserService = {
  create: async (data: UserData): Promise<IUser | Error> => {
    try {
      const { password } = data;
      if (password) {
        data.password = bcrypt.hashSync(password, salt);
      }
      const user = new UserModel(data);
      const result: any = await user.save();
      delete result?.password;
      return result;
    } catch (error) {
      return error;
    }
  },

  /**
   * @description: This function is used to find user via id
   * @param : _id
   * @returns : user response with data records
   */
  findById: async (id: string): Promise<IUser> => {
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
    id: string,
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
  deleteUser: async (id: string): Promise<UserResult> => {
    const result: any = {};
    try {
      const data = await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          isDeleted: true
        }
      ).lean();
      if (!data) {
        result.error = responseMessage.SOME_ERROR_OCCURRED;
      }
    } catch (error) {
      result.error = error?.message;
    }
    return result;
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
    const result: any = {};
    try {
      const sortObj: any = {};
      const orderNum = order === 'asc' ? 1 : -1;
      if (sort) {
        sortObj[sort] = +orderNum;
      } else {
        sortObj['username'] = 1;
      }

      const match: any[] = [{ isDeleted: false }];
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
      result.error = e?.message;
    }
  }
};
export default UserService;