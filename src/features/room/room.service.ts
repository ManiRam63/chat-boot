import mongoose, { QueryOptions } from 'mongoose';
import { IMetaData, IRoom } from '../../interface/IRoom';
import RoomModel from '../../model/room.model';
import RoomMemberModel from '../../model/roomMember.model';
import { ResponseMessage } from '../../utils/responseMessage';
import { IRoomMember } from '../../interface/IRoomMember';

const RoomService = {
  /**
   * @description This function is used to create room in the database
   * @param :userId , data
   * @returns room object data
   */

  create: async (userId: mongoose.Types.ObjectId, data: IRoom): Promise<IRoom> => {
    try {
      data.createdBy = userId;
      const room = new RoomModel(data);
      const saved = await room.save();
      return saved;
    } catch (error) {
      return error;
    }
  },
  /**
   * @description This function is used to find the room in the database via id
   * @param {*} id
   * @returns room object data
   */
  findById: async (id: mongoose.Types.ObjectId): Promise<IRoom> => {
    try {
      return await RoomModel.findById(id).populate('createdBy').lean();
    } catch (error) {
      return error;
    }
  },
  /**
   * @description : this function is used to find the room via attributes
   * @param {*} data
   * @returns object of room data || {}
   */
  findByAttribute: async (attributes: IRoom): Promise<IRoom> => {
    try {
      const room: any = await RoomModel.findOne(attributes).populate('createdBy').lean();
      return room;
    } catch (error) {
      return error;
    }
  },
  /**
   * @description This function is used to update room with the id
   * @param : requestObj
   * @returns success or error message
   */
  updateRoom: async (attributes: IRoom): Promise<{ data?: IRoom; error?: string }> => {
    try {
      const { _id, ...rest } = attributes;
      const data: IRoom = await RoomModel.findByIdAndUpdate(_id, rest, {
        new: true
      }).lean();
      if (!data) {
        return { error: ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
      } else {
        return { data };
      }
    } catch (error) {
      return { error: error?.message };
    }
  },
  /**
   * @description This function is used to delete the user
   * @param {*} id
   * @returns success or error message
   */
  deleteRoom: async (id: mongoose.Types.ObjectId): Promise<{ message?: string; error?: string }> => {
    try {
      const data = await RoomModel.findByIdAndUpdate(id, {
        isDeleted: true
      }).lean();
      if (!data) {
        return { error: ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
      } else {
        return { message: ResponseMessage.ROOM.ROOM_DELETED_SUCCESSFULLY };
      }
    } catch (error) {
      return {
        error: error?.message || ResponseMessage.ROOM.SOME_ERROR_OCCURRED
      };
    }
  },
  /**
   * @description ; This function is used to getting list from deb
   * @param {QueryOptions}
   * @returns data , metadata
   */
  list: async (body: QueryOptions): Promise<{ rooms?: IRoom; metaData?: IMetaData; error?: string }> => {
    const { limit = 10, sort, page = 1, search: searchVal, order } = body;
    const offset = limit * (page - 1) || 0;
    try {
      const sortObj = {};
      const orderNum = order === 'asc' ? 1 : -1;
      if (sort) {
        sortObj[sort] = +orderNum;
      } else {
        sortObj['name'] = 1;
      }

      const match = [];
      match.push({
        isDeleted: false
      });
      let search: string = '';
      if (typeof searchVal === 'string') {
        search = searchVal.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      match.push({
        $or: [
          {
            name: {
              $regex: search,
              $options: 'i'
            }
          },
          {
            roomType: {
              $regex: search,
              $options: 'i'
            }
          }
        ]
      });

      const where = {
        $and: match
      };
      const dataCond = [{ $sort: sortObj }, { $skip: +offset }, { $limit: +limit }];
      const aggregation = [
        { $match: where },
        {
          $project: {
            password: 0,
            __v: 0
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
      const roomList = await RoomModel.aggregate(aggregation, {
        collation: { locale: 'en' }
      });
      const metaData = {
        totalRecords: roomList[0]?.metadata[0]?.total || 0,
        currentPage: page,
        recordPerPage: limit
      };
      const rooms = roomList.length ? roomList[0].data : [];
      return { rooms, metaData };
    } catch (e) {
      return { error: e?.message || ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
    }
  },
  /**
   * @description: this function is used to to add user to room
   * @param {*} dataObj
   * @returns
   */
  addRoomMember: async (attributes: IRoomMember): Promise<{ error?: string; result?: IRoomMember }> => {
    try {
      const member = new RoomMemberModel(attributes);
      const result: any = await member.save();
      if (!result) {
        return { error: ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  /**
   * @description : this function is used to find the room via attributes
   * @param {*} data
   * @returns object of room data || {}
   */
  findMemberInRoom: async (attributes: IRoomMember): Promise<{ error?: string; result?: IRoomMember }> => {
    try {
      return await RoomMemberModel.findOne(attributes).populate('roomId').populate('userId').lean();
    } catch (error) {
      return error;
    }
  },

  /**
   * @description : this function is used to delete user from the room
   * @param {*} data
   * @returns
   */
  deleteMemberFromRoom: async (attributes: IRoomMember): Promise<{ error?: string; result?: IRoomMember }> => {
    try {
      return await RoomMemberModel.deleteOne(attributes).lean();
    } catch (error) {
      return error;
    }
  },
  /**
   * @description : this function is used to get user data
   * @param {*} body
   * @returns
   */
  findMemberOfRoom: async (body: IRoomMember): Promise<{ error?: string; result?: IRoomMember }> => {
    try {
      const { roomId } = body;
      const aggregation = [
        {
          $match: {
            roomId: roomId,
            isDeleted: false
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  username: 1,
                  firstname: 1,
                  lastname: 1,
                  email: 1,
                  isGuest: 1,
                  status: 1
                }
              }
            ],
            as: 'users'
          }
        },
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'rooms'
          }
        },
        { $unwind: { path: '$rooms' } },
        { $unwind: { path: '$users' } },
        {
          $group: {
            _id: '$roomId',
            roomName: { $first: '$rooms.name' },
            roomId: { $first: '$rooms._id' },
            members: { $addToSet: '$users' }
          }
        }
      ];
      const memberList = await RoomMemberModel.aggregate(aggregation, {
        collation: { locale: 'en' }
      });
      const result = memberList.length ? memberList : [];
      return result[0];
    } catch (e) {
      return { error: e?.message || ResponseMessage.ROOM.SOME_ERROR_OCCURRED };
    }
  }
};
export default RoomService;
