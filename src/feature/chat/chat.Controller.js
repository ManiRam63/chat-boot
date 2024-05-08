const {
  errorResponse,
  successResponse,
} = require("../../utils/responseInterceptor");
const UserService = require("../user/user.Service");
const RoomService = require("../room/room.Service");
const { roomChatSchema, addChatSchema } = require("./chat.Schema");
const ChatService = require("./chat.Service");
const { ROOM, CHAT, USER } = require("../../utils/responseMessage.js");
const logger = require("../../utils/logger.js");
const filename = "chat.Controller.js";
module.exports = {
  /**
   * @description : this function is used to create a new user
   * @param {*} req
   * @param {*} res
   * @returns Success or Failure message
   */
  userChat: async (req, res) => {
    // validate user schema
    try {
      const validate = roomChatSchema.validate(req.body);
      if (validate.error) {
        logger.error(validate.error.toSt + filename);
        return errorResponse(res, validate.error.message, 400, null);
      }
      const room = await RoomService.findById(req?.body?.roomId);
      if (!room) {
        logger.error(ROOM.ROOM_NOT_FOUND + filename);
        return errorResponse(res, ROOM.ROOM_NOT_FOUND, 404, null);
      }
      const result = await ChatService.userChat(req.body);
      if (result?.error || result?.message) {
        let message =
          result.message ||
          result?.error ||
          CHAT.SOME_ERROR_OCCURRED_ON_CREATING_CHAT;
        logger.error(message + filename);
        return errorResponse(res, message, 401, null);
      } else {
        return successResponse(res, CHAT.CHAT_FETCH_SUCCESSFULLY, 200, result);
      }
    } catch (error) {
      logger.error(error?.message + filename);
      return errorResponse(res, error.message, 500, null);
    }
  },
  /**
   * @description : this function is used to get all user data
   * @param {*} req
   * @param {*} res
   */
  findAll: async (req, res) => {
    try {
      const { data, metaData } = await RoomService.list(req?.query);

      return successResponse(
        res,
        ROOM.ROOM_FETCH_SUCCESSFULLY,
        200,
        data,
        metaData
      );
    } catch (error) {
      logger.error(error?.message + filename);
      return errorResponse(res, error.message, 500, null);
    }
  },
  /**
   * @description : this function is used to get user via id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  findOne: async (req, res) => {
    try {
      const room = await RoomService.findById(req?.params?.id);
      if (!room) {
        logger.error(ROOM.ROOM_NOT_FOUND + filename);
        return errorResponse(res, ROOM.ROOM_NOT_FOUND, 404, null);
      }
      return successResponse(res, ROOM.ROOM_FETCH_SUCCESSFULLY, 200, room);
    } catch (error) {
      logger.error(error.message + filename);
      return errorResponse(res, error.message, 500, null);
    }
  },
  /**
   * @description : this function is used to update user via id
   * @param {*} req
   * @param {*} res
   * @returns updated object of user
   */
  createChat: async (req, res) => {
    try {
      const validate = addChatSchema.validate(req.body);
      if (validate.error) {
        logger.error(validate.error.message + filename);
        return errorResponse(res, validate.error.message, 400, null);
      }
      const room = await RoomService.findById(req?.body?.roomId);
      if (!room) {
        logger.error(ROOM.ROOM_NOT_FOUND + filename);
        return errorResponse(res, ROOM.ROOM_NOT_FOUND, 404, null);
      }
      const result = await ChatService.createChat(req.body);
      if (result?.error) {
        let message = result?.error
          ? result?.error
          : USER.SOME_ERROR_OCCURRED_ON_UPDATING_USER;
        logger.error(message + filename);
        return errorResponse(res, message, 401, null);
      } else {
        return successResponse(
          res,
          CHAT.CHAT_CREATED_SUCCESSFULLY,
          200,
          result.data
        );
      }
    } catch (error) {
      logger.error(error?.message + filename);
      return errorResponse(res, error?.message, 401, null);
    }
  },
  /**
   * @description this function is used to delete the user
   * @param {*} req
   * @param {*} res
   * @returns success or error message
   */
  delete: async (req, res) => {
    try {
      const id = req?.params?.id;
      if (!id) {
        logger.error(ROOM.ROOM_ID_REQUIRED + filename);
        return errorResponse(res, ROOM.ROOM_ID_REQUIRED, 400, null);
      }
      const room = await RoomService.findById(id);
      if (!room) {
        logger.error(ROOM.ROOM_NOT_FOUND + filename);
        return errorResponse(res, ROOM.ROOM_NOT_FOUND, 404, null);
      }
      const result = await RoomService.deleteRoom(id);
      if (result?.error) {
        let message = result?.error
          ? result?.error
          : USER.SOME_ERROR_OCCURRED_ON_DELETING_USER;
        logger.error(message + filename);
        return errorResponse(res, message, 401, null);
      } else {
        return successResponse(
          res,
          ROOM.ROOM_DELETED_SUCCESSFULLY,
          200,
          result
        );
      }
    } catch (error) {
      logger.error(error?.message + filename);
      return errorResponse(res, error?.message, 503, null);
    }
  },
  /**
   * @description : This function is used to update the user's in room
   * @param {*} req
   * @param {*} res
   * @returns
   */
  AddMember: async (req, res) => {
    try {
      const validate = updateMemberSchema.validate(req.body);
      if (validate.error) {
        logger.error(error?.message + filename);
        return errorResponse(res, validate.error.message, 400, null);
      }
      const { roomId, users } = req.body;
      let notFound = [];
      let count = 0;
      const room = await RoomService.findById(roomId);
      if (!room) {
        logger.error(ROOM.ROOM_NOT_FOUND + filename);
        return errorResponse(res, ROOM.ROOM_NOT_FOUND, 404, null);
      }

      for (const id of users) {
        const isExist = await UserService.findByAttribute({ _id: id });
        if (!isExist) {
          notFound.push(id);
        } else {
          //check if the user already exists in the room
          const isExistInRoom = await RoomService.findMemberInRoom({
            roomId: roomId,
            userId: isExist?._id,
          });
          if (!isExistInRoom) {
            await RoomService.addRoomMember({ roomId, userId: isExist?._id });
          }
          count++;
        }
      }
      if (notFound.length > 0) {
        return successResponse(res, ROOM.ROOM_USER_ADDED_PARTIALLY, 207, null);
      }
      if (users.length === count) {
        return successResponse(
          res,
          ROOM.ROOM_USER_ADDED_SUCCESSFULLY,
          200,
          null
        );
      }
    } catch (error) {
      logger.error(error.message + filename);
      return errorResponse(res, error?.message, 401, null);
    }
  },
  /**
   * @description : This function is used to update the user's in room
   * @param {*} req
   * @param {*} res
   * @returns
   */
  deleteMember: async (req, res) => {
    try {
      const validate = deleteMemberSchema.validate(req.body);
      if (validate.error) {
        logger.error(validate.error + filename);
        return errorResponse(res, validate.error.message, 400, null);
      }
      const { roomId, userId } = req.body;
      const room = await RoomService.findById(roomId);
      if (!room) {
        logger.error(ROOM.ROOM_NOT_FOUND + filename);
        return errorResponse(res, ROOM.ROOM_NOT_FOUND, 404, null);
      }
      const isExistInRoom = await RoomService.findMemberInRoom({
        roomId: roomId,
        userId: userId,
      });

      if (!isExistInRoom) {
        logger.error(ROOM.ROOM_AND_USER_COMBINATION + filename);
        return errorResponse(res, ROOM.ROOM_AND_USER_COMBINATION, 404, null);
      }
      const result = await RoomService.deleteMemberFromRoom({
        roomId: roomId,
        userId: userId,
      });

      if (result?.error) {
        let message = result?.error
          ? result?.error
          : USER.SOME_ERROR_OCCURRED_ON_DELETING_USER;
        logger.error(message + filename);
        return errorResponse(res, message, 401, null);
      } else {
        return successResponse(res, USER.USER_DELETED_SUCCESSFULLY, 200);
      }
    } catch (error) {
      logger.error(error?.message + filename);
      return errorResponse(res, error?.message, 503, null);
    }
  },

  /**
   * @description : This function is used to update the user's in room
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getUserRoomId: async (req, res) => {
    try {
      const validate = getUserSchema.validate(req.query);
      if (validate.error) {
        logger.error(validate.error + filename);
        return errorResponse(res, validate.error.message, 400, null);
      }
      const users = await RoomService.findMemberOfRoom(req.query);
      if (!users) {
        return successResponse(res, USER.USER_FETCH_SUCCESSFULLY, 200, []);
      } else {
        return successResponse(res, USER.USER_FETCH_SUCCESSFULLY, 200, users);
      }
    } catch (error) {
      logger.error(error.message + filename);
      return errorResponse(res, error?.message, 503, null);
    }
  },
};
