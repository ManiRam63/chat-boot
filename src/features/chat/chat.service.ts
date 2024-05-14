import mongoose, { QueryOptions } from 'mongoose';
import { IChat, IChatResponse } from '../../interface/IChat';
import ChatModel from '../../model/chat.model';
import logger from '../../utils/logger';
import { ResponseMessage } from '../../utils/responseMessage';
import { IMetaData } from '../../interface/IRoom';
import { IUserChat } from '../../interface/IUserChat';
const ObjectId = mongoose.Types.ObjectId;
const filename = ' chat.service.ts ';
const ChatService = {
  /**
   * @description : This function is used to create user chat
   * @param data
   * @returns object of chat data
   */
  createChat: async (data: IChat): Promise<IChatResponse> => {
    try {
      const chat = new ChatModel(data);
      const result: IChatResponse = await chat.save();
      return result;
    } catch (error) {
      logger.error(error.message + filename, {
        meta: error
      });
      return error;
    }
  },

  /**
   * @description : this function is used to get the user chat
   * @param objectData
   * @returns
   */
  userChat: async (objectData: QueryOptions): Promise<{ userChat?: IUserChat; metaData?: IMetaData; error?: string }> => {
    const { limit = 10, sort, page = 1, order, roomId } = objectData;
    const offset = limit * (page - 1) || 0;
    try {
      const sortObj = {};
      const orderNum = order === 'asc' ? 1 : -1;
      if (sort) {
        sortObj[sort] = +orderNum;
      } else {
        sortObj['message'] = 1;
      }
      const dataCond = [{ $sort: sortObj }, { $skip: +offset }, { $limit: +limit }];
      const aggregation = [
        {
          $match: {
            roomId: new ObjectId(roomId)
          }
        },
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'room'
          }
        },
        {
          $unwind: {
            path: '$room'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            'user.password': 0,
            'user.__v': 0,
            'room.__v': 0
          }
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total'
              }
            ],
            data: dataCond
          }
        }
      ];
      const chatList = await ChatModel.aggregate(aggregation, {
        collation: { locale: 'en' }
      });
      const metaData = {
        totalRecords: chatList[0]?.metadata[0]?.total || 0,
        currentPage: page,
        recordPerPage: limit
      };
      const userChat: IUserChat = chatList.length ? chatList[0].data : [];
      return { userChat, metaData };
    } catch (e) {
      logger.error(e.message + filename, {
        meta: e
      });
      return { error: e?.message || ResponseMessage.CHAT.SOME_ERROR_OCCURRED };
    }
  }
};
export default ChatService;
