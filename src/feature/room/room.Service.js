const RoomModel = require('../../models/RoomModel');
const RoomMembersModel = require('../../models/RoomMemberModel');
const ObjectId = require('mongodb').ObjectId;
const { ROOM } = require('../../utils/responseMessage');
module.exports = {
    create: async ( userId , data) => {
        try {
        data.createdBy = userId;
        const room = new RoomModel(data);
        return await room.save();
        } catch (error) {
            return error;
        }
    },
    /**
     * @description This function is used to find the room in the database via id
     * @param {*} _id 
     * @returns 
     */
    findById: async (id) => {
        try {
            return await RoomModel.findOne({ _id:id }).lean()
        } catch (error) {
            return error
        }
    },
    /**
     * @description : this function is used to find the room via attributes 
     * @param {*} data 
     * @returns object of room data || {}
     */
    findByAttribute: async (attributes) => {
        try {
          const user = await RoomModel.findOne(attributes).lean()
            return user
        } catch (error) {
            return error
        }
    },
    /**
     * @description This function is used to update room with the id
     * @param {*} requestObj 
     * @returns success or error message
     */
    updateRoom: async (requestObj) => {
        let result = {}
        try {
            const { _id, ...rest } = requestObj;
            const data = await RoomModel.findByIdAndUpdate(_id, rest ,  {new: true} ).lean()
            if (!data) {
                result.errmsg = "Room not found!"
                return result
            } else {
                result.data = data
                return result
            }
        } catch (error) {
            result.errmsg = error?.message
            return result
        }
    },
    /**
     * @description This function is used to delete the user
     * @param {*} id 
     * @returns success or error message
     */
    deleteRoom: async (id) => {
        let result = {}
        try {
            const data = await RoomModel.findByIdAndUpdate(id, { isDeleted: true }).lean()
            if (!data) {
                result.errmsg = ROOM.SOMETHIG_WENT_WRONG
                return result
            } else {
                result = []
                return result
            }
        } catch (error) {
            result.errmsg = error?.message
            return result
        }
    },
    /**
     * 
     * @param {*} body 
     * @returns 
     */
    list: async (body) => {
        const { limit = 10, sort, page = 1, search = '', order } = body
        const offset = limit * (page - 1) || 0
        let result ={}
        try {
            const sortObj = {}
            const orderNum = order === 'asc' ? 1 : -1
            if (sort) {
                sortObj[sort] = +orderNum
            } else {
                sortObj['name'] = 1
            }

            const match = []
            match.push({
                isDeleted: { $ne: true },
            })
            let searchval =''
            if (search) {
               searchval = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            }
            match.push({
                $or: [
                    {
                        name: {
                            $regex: searchval,
                            $options: 'i',
                        },
                    },
                    {
                        roomType: {
                            $regex: searchval,
                            $options: 'i',
                        },
                    },
                ],
            })

            const where = {
                $and: match,
            }
            const dataCond = [{ $sort: sortObj }, { $skip: +offset }, { $limit: +limit }]
            const aggregation = [
                { $match: where },
                {
                    $project: {
                        password: 0,
                    },
                },
                {
                    $facet: {
                        metadata: [
                            {
                                $count: 'total',
                            },
                        ],
                        data: dataCond,
                    },
                },
            ]

            const roomList = await RoomModel.aggregate(aggregation, {
                collation: { locale: 'en' },
            })
            const metaData = {
                totalRecords: roomList[0]?.metadata[0]?.total || 0,
                currentPage: page,
                recordPerPage: limit,
            }

            result.data = roomList.length ? roomList[0].data : []
            result.metaData = metaData
            return result
        } catch (e) {
            result.errmsg = e?.message
            return result
        }
    },
/**
 * @description: this function is used to to add user to room
 * @param {*} dataObj 
 * @returns 
 */
    addRoomMember:async ( dataObj )=>{
        try {
            const member = new RoomMembersModel(dataObj);
           const result = await member.save();
           if(!result){
              result.errmsg = ROOM.SOME_ERROR_OCCURRED
              return result;
           }
           return result;
        } catch (error) {
            return error
        }
    },

/**
 * @description : this function is used to find the room via attributes 
 * @param {*} data 
 * @returns object of room data || {}
 */
    findMemberInRoom: async (attributes) => {
        try {
            const user = await RoomMembersModel.findOne(attributes).lean()
            return user
        } catch (error) {
            return error
        }
    },

    /**
 * @description : this function is used to delete user from the room 
 * @param {*} data 
 * @returns 
 */
    deleteMemberFromRoom: async (attributes) => {
        try {
            const deleted = await RoomMembersModel.deleteOne(attributes).lean()
            return deleted
        } catch (error) {
            return error
        }
    },
    /**
     * @description : this function is used to get user data
     * @param {*} body 
     * @returns 
     */
    findMemberOfRoom: async (body) => {
        let result ={}
        try {
            const { roomId } = body
            const aggregation = [
                {
                  $match: {
                    roomId: { $eq: ObjectId(roomId)},
                    isDeleted: { $ne: true }
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
                            email:1,
                            isGuest:1,
                            status:1,
                          },
                        },
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
                },
            ]
            const memberList = await RoomMembersModel.aggregate(aggregation, {
                collation: { locale: 'en' },
            })
            result = memberList.length ? memberList : []
            return result
        } catch (e) {
            result.errmsg = e?.message
            return result
        }
    },
}
