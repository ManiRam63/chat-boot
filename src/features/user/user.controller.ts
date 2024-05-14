import { Request, Response } from 'express';
import { createUserSchema, updateUserSchema, userResetPassword } from './user.schema';
import {
  errorResponse,
  successResponse
} from '../../utils/responseHandler/responseHandler';
import { ResponseMessage } from '../../utils/responseMessage';
import UserService from './user.service';
import { IUser, IUserResponse, IUserRestPasswordResponse } from '../../interface/IUser';
import logger from '../../utils/logger';
import bcrypt from 'bcrypt';
import { STATES } from 'mongoose';
import { STATUSCODE } from '../../utils/statusCode';
const ResponseMessages = ResponseMessage.USER;
const fileName = 'user.controller.ts'
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
        logger.error(validate.error.message + fileName, {
          meta: validate.error
        });
        return errorResponse(res, validate.error.message, STATUSCODE.BadRequest);
      }
      const { email, username } = req.body;
      //to check email is already exist or not //
      const IsExit = await UserService.findByAttribute({ email: email });
      if (IsExit) {
        return errorResponse(res, ResponseMessage.USER.DUPLICATE_EMAIL, STATUSCODE.BadRequest);
      }
      // check username already exist or not //
      const IsExitUsername = await UserService.findByAttribute({ username: username });
      if (IsExitUsername) {
        return errorResponse(res, ResponseMessage.USER.USERNAME_ALREADY_EXIST, STATUSCODE.BadRequest);
      }
      const result: IUserResponse = await UserService.create(req.body);
      if (result?.error || result?.message) {
        const message = result.message
          ? result.message
          : result?.error
            ? result?.error
            : ResponseMessages.SOME_ERROR_OCCURRED;
        logger.error(message + fileName, {
          meta: result?.error || result.message
        });
        return errorResponse(res, message, STATUSCODE.InternalServerError);
      } else {
        successResponse(
          res,
          ResponseMessages.USER_CREATED_SUCCESSFULLY,
          200,
          result
        );
      }
    } catch (error) {
      logger.error(error.message + fileName, {
        meta: error
      });
      errorResponse(res, error.message, STATUSCODE.InternalServerError);
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
        logger.error(ResponseMessage.USER.USER_NOT_FOUND + fileName, {
          meta: ResponseMessage.USER.USER_NOT_FOUND
        });
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, STATUSCODE.NotFound);
      }
      return successResponse(
        res,
        ResponseMessage.USER.USER_FETCH_SUCCESSFULLY,
        STATUSCODE.OK,
        user
      );
    } catch (error) {
      logger.error(error.message + fileName, {
        meta: error
      });
      return errorResponse(res, error.message, STATUSCODE.InternalServerError);
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
      return successResponse(
        res,
        ResponseMessage.USER.USER_FETCH_SUCCESSFULLY,
        STATUSCODE.OK,
        result
      );
    } catch (error) {
      logger.error(error.message + fileName, {
        meta: error
      });
      return errorResponse(res, error.message, STATUSCODE.InternalServerError);
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
        logger.error(validate.error + fileName, {
          meta: validate.error
        });
        return errorResponse(res, validate.error.message, STATUSCODE.BadRequest);
      }
      const user = await UserService.findById(id);
      if (!user) {
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, STATUSCODE.NotFound);
      }
      const result = await UserService.updateUser(id, req.body);
      if (result?.error) {
        let message = result?.error
          ? result?.error
          : ResponseMessage.USER.SOME_ERROR_OCCURRED;
        logger.error(message + fileName, {
          meta: result?.error
        });
        return errorResponse(res, message, STATUSCODE.InternalServerError);
      } else {
        return successResponse(
          res,
          ResponseMessage.USER.USER_UPDATED_SUCCESSFULLY,
          200,
          result
        );
      }
    } catch (error) {
      logger.error(error.message + fileName, {
        meta: error
      });
      return errorResponse(res, error?.message, STATUSCODE.InternalServerError);
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
        logger.error(ResponseMessage.USER.USER_ID_REQUIRED + fileName, {
          meta: ResponseMessage.USER.USER_ID_REQUIRED
        });
        return errorResponse(res, ResponseMessage.USER.USER_ID_REQUIRED, STATUSCODE.BadRequest);
      }
      const user: IUser = await UserService.findById(id);
      if (!user) {
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, STATUSCODE.NotFound);
      }
      const result = await UserService.deleteUser(id);
      if (result?.error) {
        let message = result?.error
          ? result?.error
          : ResponseMessage.USER.SOME_ERROR_OCCURRED;
        logger.error(message + fileName, {
          meta: result?.error
        });
        return errorResponse(res, message, STATUSCODE.InternalServerError);
      } else {
        return successResponse(
          res,
          ResponseMessage.USER.USER_DELETED_SUCCESSFULLY,
          STATUSCODE.OK,
          result
        );
      }
    } catch (error) {
      logger.error(error.message + fileName, {
        meta: error
      });
      return errorResponse(res, error?.message, STATUSCODE.InternalServerError);
    }
  },
  /**
 * @description : This function is used to reset user password 
 * @param {*} req
 * @param {*} res
 * @returns response message or error response 
 */
  resetPassword: async (req: Request, res: Response): Promise<IUserRestPasswordResponse> => {
    try {
      // to check if user id
      const validate = userResetPassword.validate(req.body);
      if (validate.error) {
        logger.error(validate.error + fileName, {
          meta: validate.error
        });
        return errorResponse(res, validate.error.message, STATUSCODE.NotFound);
      }
      const { email, oldPassword } = req.body
      const user: IUser = await UserService.findByAttribute({ email: email });
      if (!user) {
        logger.error(ResponseMessage.USER.USER_NOT_FOUND + fileName, {
          meta: ResponseMessage.USER.USER_NOT_FOUND
        });
        return errorResponse(res, ResponseMessage.USER.USER_NOT_FOUND, STATUSCODE.NotFound);
      }
      // To check old password is match or not //
      const isMatched: boolean = await bcrypt.compare(oldPassword, user.password);
      if (!isMatched) {
        logger.error(ResponseMessage.USER.OLD_PASSWORD_NOT_MATCHED + fileName, {
          meta: ResponseMessage.USER.OLD_PASSWORD_NOT_MATCHED
        });
        return errorResponse(res, ResponseMessage.USER.OLD_PASSWORD_NOT_MATCHED, STATUSCODE.BadRequest);
      }
      await UserService.resetPassword(req.body);
      return successResponse(
        res,
        ResponseMessage.USER.PASSWORD_UPDATED_SUCCESSFULLY,
        200,
        []
      );
    } catch (error) {
      logger.error(error.message + fileName, {
        meta: error
      });
      return errorResponse(res, error.message, STATUSCODE.InternalServerError);
    }
  },
};
export default UserController;
