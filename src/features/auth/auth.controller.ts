import { IUser, IUserSignInResponse } from '../../interface/IUser';
import logger from '../../utils/logger';
import {
    errorResponse,
    successResponse
} from '../../utils/responseHandler/responseHandler';
import { ResponseMessage } from '../../utils/responseMessage';
import { STATUSCODE } from '../../utils/statusCode';
import { loginSchema } from '../auth/auth.schema';
import AuthService from './auth.service';
import { Request, Response } from 'express';
const filename: string = ' :- in auth.controller.js';
const responseMessage = ResponseMessage.AUTH;
const AuthController = {
    /**
     * @description : This function is used to signIn user
     * @param req
     * @param res
     * @returns
     */
    signIn: async (req: Request, res: Response): Promise<IUser> => {
        try {
            const { body } = req;
            const validateResult = loginSchema.validate(body);
            if (validateResult.error) {
                const errorMessage = validateResult.error.message;
                return errorResponse(res, errorMessage, STATUSCODE.BadRequest);
            }
            const result: IUserSignInResponse = await AuthService.signIn(body);
            if (result?.error || result?.message) {
                const message =
                    result.message ||
                    result?.error ||
                    responseMessage.SOME_ERROR_OCCURRED;
                logger.error(`${message} ${filename}`, {
                    meta: result?.error
                });
                return errorResponse(
                    res,
                    message,
                    STATUSCODE.InternalServerError
                );
            }
            return successResponse(
                res,
                responseMessage.LOGIN_SUCCESSFULLY,
                STATUSCODE.OK,
                result
            );
        } catch (error) {
            logger.error(`${error.message} ${filename}`, {
                meta: error
            });
            return errorResponse(
                res,
                error.message,
                STATUSCODE.InternalServerError
            );
        }
    }
};
export default AuthController;
