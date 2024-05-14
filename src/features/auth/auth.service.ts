import UserService from '../user/user.service';
import { ResponseMessage } from '../../utils/responseMessage';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger';
import { IUser, IUserLoginResponse } from '../../interface/IUser';
const responseMessage = ResponseMessage.AUTH;
const filename: string = 'auth.service.js';
const AuthService = {
  /**
   * @description: This function is used to sign in the user
   * @param : email , password
   * @returns user data with token
   */
  signIn: async (data: { email: string; password: string }): Promise<{ error?: string; result?: IUser }> => {
    let result: IUser = {};
    const { email, password } = data;
    try {
      const user: IUser = await UserService.findByAttribute({
        email: email,
        isDeleted: false
      });
      if (!user) {
        result.error = responseMessage.USER_NOT_FOUND;
        logger.error(result.error + filename, { meta: result.error });
        return result;
      }
      const isMatched: boolean = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        result.error = responseMessage.PASSWORD_MISMATCH;
        logger.error(result.error + filename, { meta: result.error });
        return result;
      }
      const jwtSecretKey: string | undefined = process.env.JWT_SECRET_KEY;
      const jwtTokenObj: { time: Date; user: IUser } = {
        time: new Date(),
        user: user
      };
      if (!jwtSecretKey) throw new Error(responseMessage.JWT_SECRET_KEY_NOT_FOUND);

      const token: string = jwt.sign(jwtTokenObj, jwtSecretKey, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      const id = user._id;
      const data: IUserLoginResponse = await UserService.findById(id);
      if (!data) {
        result.error = responseMessage.USER_NOT_FOUND;
        logger.error(result.error + filename, { meta: result.error });
        return result;
      }
      data.token = token;
      return data;
    } catch (error) {
      logger.error(error.message + filename, { meta: error });
      return error;
    }
  },
  /**
   *@description : this function is used to find user via id
   * @param _id
   * @returns data Object
   */
  findById: async (_id: string): Promise<IUser | null> => {
    try {
      return await UserService.findById(_id);
    } catch (error) {
      logger.error(error.message + filename, { meta: error });
      return null;
    }
  },
  /**
   * @description: this function is used to find user data via attributes
   * @param attributes
   * @returns array of object
   */
  findByAttribute: async (attributes: IUser): Promise<IUser> => {
    try {
      return await UserService.findByAttribute(attributes);
    } catch (error) {
      logger.error(error.message + filename, { meta: error });
      return error;
    }
  }
};
export default AuthService;
