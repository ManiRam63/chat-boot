import { Request, Response } from 'express';
import { createUserSchema, updateUserSchema } from './user.schema';
import {
  errorResponse,
  successResponse
} from '../../utils/responseHandler/responseHandler';
import { ResponseMessage } from '../../utils/responseMessage';
import UserService from './user.service';
import { IUser } from '../../interface/IUser';
const ResponseMessages = ResponseMessage.USER;

/**
 * @description : this function is used to create a new user
 * @param {*} req
 * @param {*} res
 * @returns Success or Failure message
 */
const UserController = {
  create: async (req: Request, res: Response): Promise<IUser> => {
    try {
      const validate = createUserSchema.validate(req?.body);
      if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
      }
      const { email } = req.body;
      //to check email is already exist or not //
      const IsExit = await UserService.findByAttribute({ email: email });
      if (IsExit) {
        return errorResponse(res, ResponseMessage.USER.DUPLICATE_EMAIL, 409);
      }
      const result: IUser = await UserService.create(req.body);
      if (result?.error || result?.message) {
        const message = result.message
          ? result.message
          : result?.error
            ? result?.error
            : ResponseMessages.SOME_ERROR_OCCURRED;
        return errorResponse(res, message, 401);
      } else {
        successResponse(
          res,
          ResponseMessages.USER_CREATED_SUCCESSFULLY,
          200,
          result
        );
      }
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  },

  /**
   * @description : this function is used to get user via id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  findOne: async (req: Request, res: Response): Promise<IUser> => {
    try {
      // to check if user id
      const user: IUser = await UserService.findById(req?.params?.id);
      if (!user) {
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, 404);
      }
      return successResponse(
        res,
        ResponseMessage.USER.USER_FETCH_SUCCESSFULLY,
        200,
        user
      );
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  /**
   * @description : this function is used to get all user data
   * @param {*} req
   * @param {*} res
   */
  findAll: async (req: Request, res: Response): Promise<IUser> => {
    try {
      const result = await UserService.list(req?.query);
      console.log(result);
      return successResponse(
        res,
        ResponseMessage.USER.USER_FETCH_SUCCESSFULLY,
        200,
        result
      );
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
  /**
   * @description : this function is used to get all user data
   * @param {*} req
   * @param {*} res
   */
  update: async (req: Request, res: Response): Promise<IUser> => {
    try {
      const validate = updateUserSchema.validate(req.body);
      const id = req?.params?.id;
      if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
      }
      const user = await UserService.findById(id);
      if (!user) {
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, 404);
      }
      const result = await UserService.updateUser(id, req.body);
      if (result?.error) {
        let message = result?.error
          ? result?.error
          : ResponseMessage.USER.SOME_ERROR_OCCURRED;
        return errorResponse(res, message, 401);
      } else {
        return successResponse(
          res,
          ResponseMessage.USER.USER_UPDATED_SUCCESSFULLY,
          200,
          result
        );
      }
    } catch (error) {
      return errorResponse(res, error?.message, 401);
    }
  },
  /**
   * @description this function is used to delete the user
   * @param {*} req
   * @param {*} res
   * @returns success or error message
   */
  delete: async (req: Request, res: Response): Promise<IUser> => {
    try {
      const id = req?.params?.id;
      if (!id) {
        return errorResponse(res, ResponseMessage.USER.USER_ID_REQUIRED, 400);
      }
      const user: IUser = await UserService.findById(id);
      if (!user) {
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, 404);
      }
      const result = await UserService.deleteUser(id);
      if (result?.error) {
        let message = result?.error
          ? result?.error
          : ResponseMessage.USER.SOME_ERROR_OCCURRED;
        return errorResponse(res, message, 401);
      } else {
        return successResponse(
          res,
          ResponseMessage.USER.USER_DELETED_SUCCESSFULLY,
          200,
          result
        );
      }
    } catch (error) {
      return errorResponse(res, error?.message, 503);
    }
  }
};

export default UserController;