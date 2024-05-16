import { IRoomMember } from '../../interface/IRoomMember';
import logger from '../../utils/logger';
import { ResponseMessage } from '../../utils/responseMessage';
import RoomMemberModel from '../../model/roomMember.model';
import mongoose from 'mongoose';
const RoomUserService = {
    /**
     * @description: this function is used to to add user to room
     * @param {*} dataObj
     * @returns
     */
    addRoomMember: async (
        attributes: IRoomMember
    ): Promise<{ error?: string; result?: IRoomMember }> => {
        try {
            const user = new RoomMemberModel(attributes);
            const result: IRoomMember = await user.save();
            if (!result) {
                return { error: ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
            }
            return result;
        } catch (error) {
            logger.error(error.message, { meta: error });
            return error;
        }
    },
    /**
     * @description: this function is used to get user list
     * @param roomId
     * @returns
     */
    getAllUsers: async (
        roomId: mongoose.Types.ObjectId
    ): Promise<{ error?: string; result?: IRoomMember[] }> => {
        try {
            const results = await RoomMemberModel.find({ roomId: roomId });
            if (!results) {
                return { error: ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
            }
            return { result: results };
        } catch (error) {
            logger.error(error.message, { meta: error });
            return { error: error.message };
        }
    },
    /**
     * @description : this function is used to find the room via attributes
     * @param {*} data
     * @returns object of room data || {}
     */
    findRoomUser: async (
        attributes: IRoomMember
    ): Promise<{ error?: string; result?: IRoomMember[] }> => {
        try {
            return await RoomMemberModel.find(attributes).lean();
        } catch (error) {
            logger.error(error.message, { meta: error });
            return error;
        }
    }
};
export default RoomUserService;
