import { Request, Response } from 'express';
import logger from '../../utils/logger';
import {
    errorResponse,
    successResponse
} from '../../utils/responseHandler/responseHandler';
import {
    createRoomSchema,
    deleteMemberSchema,
    getUserSchema,
    updateMemberSchema,
    updateRoomSchema
} from './room.schema';
import RoomService from './room.service';
import { ResponseMessage } from '../../utils/responseMessage';
import { UserRequest } from '../../interface/IUser';
import UserService from '../user/user.service';
import { IRoom, IUserQuery } from '../../interface/IRoom';
import { IRoomMember } from '../../interface/IRoomMember';
import mongoose from 'mongoose';
import { STATUSCODE } from '../../utils/statusCode';
const fileName = 'room.Controller.js';
const RoomController = {
    /**
     * @description : this function is used to create a new user
     * @param {*} req
     * @param {*} res
     * @returns Success or Failure message
     */
    create: async (
        req: UserRequest,
        res: Response
    ): Promise<{ error?: string; result?: IRoom }> => {
        // validate user schema
        try {
            const userId = new mongoose.Types.ObjectId(req?.user?._id);
            const validate = createRoomSchema.validate(req.body);
            if (validate.error) {
                logger.error(validate.error + fileName, {
                    meta: validate.error
                });
                return errorResponse(res, validate.error.message, 400);
            }
            // validate the room name already exit or not //
            const attributesObj = {
                name: req?.body.name
            };
            const isExit = await RoomService.findByAttribute(attributesObj);
            if (isExit) {
                logger.error(
                    ResponseMessage.ROOM.ROOM_NAME_ALREADY_EXIST + fileName,
                    { meta: ResponseMessage.ROOM.ROOM_NAME_ALREADY_EXIST }
                );
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NAME_ALREADY_EXIST,
                    400
                );
            }
            const result: IRoom = await RoomService.create(userId, req.body);

            if (result?.error) {
                const message =
                    result.error || ResponseMessage.ROOM.SOME_ERROR_OCCURRED;
                logger.error(message + fileName, { meta: result?.error });
                return errorResponse(res, message, 401);
            }
            // add as a member in the room while creating a new room
            await RoomService.addRoomMember({
                roomId: result?._id,
                userId: userId
            });
            return successResponse(
                res,
                ResponseMessage.ROOM.ROOM_CREATED_SUCCESSFULLY,
                200,
                result
            );
        } catch (error) {
            logger.error(error?.message + fileName, { meta: error });
            return errorResponse(res, error.message, 500);
        }
    },
    /**
     * @description : this function is used to get all user data
     * @param {*} req
     * @param {*} res
     */
    findAll: async (req: Request, res: Response): Promise<IRoom> => {
        try {
            const result: IRoom = await RoomService.list(req?.query);
            return successResponse(
                res,
                ResponseMessage.ROOM.ROOM_FETCH_SUCCESSFULLY,
                STATUSCODE.OK,
                result
            );
        } catch (error) {
            logger.error(error?.message + fileName, { meta: error });
            return errorResponse(
                res,
                error.message,
                STATUSCODE.InternalServerError
            );
        }
    },
    /**
     * @description : this function is used to get user via id
     * @param {*} req
     * @param {*} res
     * @returns
     */
    findOne: async (req: Request, res: Response): Promise<IRoom> => {
        try {
            const id = new mongoose.Types.ObjectId(req?.params?.id);
            const room = await RoomService.findById(id);
            if (!room) {
                logger.error(ResponseMessage.ROOM.ROOM_NOT_FOUND + fileName, {
                    meta: ResponseMessage.ROOM.ROOM_NOT_FOUND
                });
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }
            return successResponse(
                res,
                ResponseMessage.ROOM.ROOM_FETCH_SUCCESSFULLY,
                STATUSCODE.OK,
                room
            );
        } catch (error) {
            logger.error(error.message + fileName, { meta: error });
            return errorResponse(
                res,
                error.message,
                STATUSCODE.InternalServerError
            );
        }
    },
    /**
     * @description : this function is used to update user via id
     * @param {*} req
     * @param {*} res
     * @returns updated object of user
     */
    update: async (req: Request, res: Response): Promise<IRoom> => {
        try {
            const validate = updateRoomSchema.validate(req.body);
            if (validate.error) {
                logger.error(validate.error + fileName, {
                    meta: validate.error
                });
                return errorResponse(
                    res,
                    validate.error.message,
                    STATUSCODE.BadRequest
                );
            }
            const room = await RoomService.findById(req.body._id);
            if (!room) {
                logger.error(ResponseMessage.ROOM.ROOM_NOT_FOUND + fileName, {
                    meta: ResponseMessage.ROOM.ROOM_NOT_FOUND
                });
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }
            const result = await RoomService.updateRoom(req.body);
            if (result?.error) {
                const message = result?.error
                    ? result?.error
                    : ResponseMessage.ROOM.SOME_ERROR_OCCURRED;
                logger.error(message + fileName, { meta: result?.error });
                return errorResponse(
                    res,
                    message,
                    STATUSCODE.InternalServerError
                );
            } else {
                return successResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_UPDATED_SUCCESSFULLY,
                    STATUSCODE.OK,
                    result.data
                );
            }
        } catch (error) {
            logger.error(error?.message + fileName, { meta: error });
            return errorResponse(res, error?.message, STATUSCODE.BadRequest);
        }
    },
    /**
     * @description this function is used to delete the user
     * @param {*} req
     * @param {*} res
     * @returns success or error message
     */
    delete: async (req: Request, res: Response): Promise<IRoom> => {
        try {
            const id = new mongoose.Types.ObjectId(req?.params?.id);
            if (!id) {
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_ID_REQUIRED,
                    STATUSCODE.BadRequest
                );
            }
            const room = await RoomService.findById(id);
            if (!room) {
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }
            const result = await RoomService.deleteRoom(id);
            if (result?.error) {
                const message = result?.error
                    ? result?.error
                    : ResponseMessage.ROOM.SOME_ERROR_OCCURRED;
                logger.error(message + fileName, { meta: result?.error });
                return errorResponse(
                    res,
                    message,
                    STATUSCODE.InternalServerError
                );
            } else {
                return successResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_DELETED_SUCCESSFULLY,
                    STATUSCODE.MovedPermanently,
                    result
                );
            }
        } catch (error) {
            logger.error(error?.message + fileName, { meta: error });
            return errorResponse(
                res,
                error?.message,
                STATUSCODE.InternalServerError
            );
        }
    },
    /**
     * @description : This function is used to update the user's in room
     * @param {*} req
     * @param {*} res
     * @returns
     */
    AddMember: async (req: Request, res: Response): Promise<IRoom> => {
        try {
            const validate = updateMemberSchema.validate(req.body);
            if (validate.error) {
                logger.error(validate.error + fileName, { meta: validate });
                return errorResponse(
                    res,
                    validate.error.message,
                    STATUSCODE.BadRequest
                );
            }
            const { roomId, users } = req.body;
            const notFound = [];
            let count: number = 0;
            const room = await RoomService.findById(roomId);
            if (!room) {
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }

            for (const id of users) {
                const isExist = await UserService.findByAttribute({ _id: id });
                if (!isExist) {
                    notFound.push(id);
                } else {
                    //check if the user already exists in the room
                    const isExistInRoom = await RoomService.findMemberInRoom({
                        roomId: roomId,
                        userId: new mongoose.Types.ObjectId(isExist?._id)
                    });
                    if (!isExistInRoom) {
                        await RoomService.addRoomMember({
                            roomId,
                            userId: new mongoose.Types.ObjectId(isExist?._id)
                        });
                    }
                    count++;
                }
            }
            if (notFound.length > 0) {
                return successResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_USER_ADDED_PARTIALLY,
                    STATUSCODE.PartiallySuccessful,
                    null
                );
            }
            if (users.length === count) {
                return successResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_USER_ADDED_SUCCESSFULLY,
                    STATUSCODE.OK,
                    null
                );
            }
        } catch (error) {
            logger.error(error.message + fileName, { meta: error });
            return errorResponse(res, error?.message, STATUSCODE.BadRequest);
        }
    },
    /**
     * @description : This function is used to update the user's in room
     * @param {*} req
     * @param {*} res
     * @returns
     */
    deleteMember: async (req: Request, res: Response): Promise<IRoom> => {
        try {
            const validate = deleteMemberSchema.validate(req.body);
            if (validate.error) {
                logger.error(validate.error + fileName, {
                    meta: validate?.error
                });
                return errorResponse(
                    res,
                    validate.error.message,
                    STATUSCODE.BadRequest
                );
            }
            const { roomId, userId } = req.body;
            const room = await RoomService.findById(roomId);
            if (!room) {
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }
            const isExistInRoom = await RoomService.findMemberInRoom({
                roomId: roomId,
                userId: userId
            });

            if (!isExistInRoom) {
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_AND_USER_COMBINATION,
                    STATUSCODE.BadRequest
                );
            }
            const result = await RoomService.deleteMemberFromRoom({
                roomId: roomId,
                userId: userId
            });

            if (result?.error) {
                const message = result?.error
                    ? result?.error
                    : ResponseMessage.ROOM.SOME_ERROR_OCCURRED;
                logger.error(message + fileName, { meta: result?.error });
                return errorResponse(
                    res,
                    message,
                    STATUSCODE.InternalServerError
                );
            } else {
                return successResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_USER_DELETED_SUCCESSFULLY,
                    STATUSCODE.OK,
                    result
                );
            }
        } catch (error) {
            logger.error(error.message + fileName, { meta: error });
            return errorResponse(
                res,
                error?.message,
                STATUSCODE.InternalServerError
            );
        }
    },
    /**
     * @description : This function is used to update the user's in room
     * @param {*} req
     * @param {*} res
     * @returns
     */
    getUserRoomId: async (req: IUserQuery, res: Response): Promise<IRoom> => {
        try {
            const validate = getUserSchema.validate(req.query);
            if (validate.error) {
                logger.error(validate.error + fileName, {
                    meta: validate.error
                });
                return errorResponse(
                    res,
                    validate.error.message,
                    STATUSCODE.BadRequest
                );
            }
            const roomId = new mongoose.Types.ObjectId(req?.query?.roomId);
            const room: IRoomMember = await RoomService.findById(roomId);
            if (!room) {
                return errorResponse(
                    res,
                    ResponseMessage.ROOM.ROOM_NOT_FOUND,
                    STATUSCODE.NotFound
                );
            }
            const users = await RoomService.findMemberOfRoom(req.query);
            if (!users) {
                return successResponse(
                    res,
                    ResponseMessage.USER.USER_FETCH_SUCCESSFULLY,
                    STATUSCODE.OK,
                    []
                );
            } else {
                return successResponse(
                    res,
                    ResponseMessage.USER.USER_FETCH_SUCCESSFULLY,
                    STATUSCODE.OK,
                    users
                );
            }
        } catch (error) {
            logger.error(error.message + fileName, { meta: error });
            return errorResponse(
                res,
                error?.message,
                STATUSCODE.InternalServerError
            );
        }
    }
};
export default RoomController;
