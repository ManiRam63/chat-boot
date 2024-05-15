import { Request, Response } from 'express';
import {
    errorResponse,
    successResponse
} from '../../utils/responseHandler/responseHandler';
import { ResponseMessage } from '../../utils/responseMessage';
import RoomService from '../room/room.service';
import { RoomChatSchema } from './chat.schema';
import ChatService from './chat.service';
import { IUserChatRes } from '../../interface/IUserChatRes';
import { STATUSCODE } from '../../utils/statusCode';
import logger from '../../utils/logger';
import { IChatResponse } from '../../interface/IChat';
const filename = 'chat.Controller.js';
const ChatController = {
    userChat: async (req: Request, res: Response): Promise<IChatResponse> => {
        try {
            const validate = RoomChatSchema.validate(req.body);
            if (validate.error) {
                logger.error(validate.error + filename, {
                    meta: validate.error
                });
                return errorResponse(
                    res,
                    validate.error.message,
                    STATUSCODE.BadRequest
                );
            }
            const { roomId } = req.body;
            const room = await RoomService.findById(roomId);
            if (!room) {
                logger.error(ResponseMessage.ROOM.ROOM_NOT_FOUND + filename, {
                    meta: ResponseMessage.ROOM.ROOM_NOT_FOUND
                });
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }
            const result = await ChatService.userChat(req.body);
            if (result?.error) {
                const message =
                    result?.error ||
                    ResponseMessage.CHAT.SOME_ERROR_OCCURRED_ON_CREATING_CHAT;
                logger.error(message + filename, {
                    meta: result?.error
                });
                return errorResponse(res, message, STATUSCODE.BadRequest);
            } else {
                return successResponse(
                    res,
                    ResponseMessage.CHAT.CHAT_FETCH_SUCCESSFULLY,
                    STATUSCODE.OK,
                    result
                );
            }
        } catch (error) {
            logger.error(error?.message + filename, { meta: error });
            return errorResponse(
                res,
                error.message,
                STATUSCODE.InternalServerError
            );
        }
    },

    /**
     * @description : this function is used to get all user data
     * @param {*} req
     * @param {*} res
     */
    findAll: async (req: Request, res: Response): Promise<IUserChatRes> => {
        try {
            const result: IUserChatRes = await RoomService.list(req?.query);
            return successResponse(
                res,
                ResponseMessage.ROOM.ROOM_FETCH_SUCCESSFULLY,
                STATUSCODE.OK,
                result
            );
        } catch (error) {
            logger.error(error?.message + filename, { meta: error });
            return errorResponse(
                res,
                error.message,
                STATUSCODE.InternalServerError
            );
        }
    }
};

export default ChatController;
