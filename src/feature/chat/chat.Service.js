const RoomMembersModel = require('../../models/RoomMemberModel');
const ChatModel = require('../../models/ChatModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
module.exports = {
    createChat: async (data) => {
        try {
            const chat = new ChatModel(data);
            return await chat.save();
        } catch (error) {
            return error;
        }
    },
    /**
     * @description This function is used to find the room in the database via id
     * @param {*} _id 
     * @returns 
     */
    findById: async (_id) => {
        try {
            return await ChatModel.findOne({ _id: _id }).lean()
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
            const user = await ChatModel.findOne(attributes).lean()
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
            const data = await ChatModel.findByIdAndUpdate(_id, rest, { new: true }).lean()
            if (!data) {
                result.errmsg = "chat not found!"
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
            const data = await ChatModel.findByIdAndUpdate(id, { isDeleted: true }).lean()
            if (!data) {
                result.errmsg = "Something went wrong try again !"
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
    userChat: async (objectData) => {
        const { limit = 10, sort, page = 1, search = '', order, roomId } = objectData
        const offset = limit * (page - 1) || 0
        let result = {}
        try {
            const sortObj = {}
            const orderNum = order === 'asc' ? 1 : -1
            if (sort) {
                sortObj[sort] = +orderNum
            } else {
                sortObj['message'] = 1
            }
            const dataCond = [{ $sort: sortObj }, { $skip: +offset }, { $limit: +limit }]
            const aggregation = [
                {
                    $match:{
                    roomId : new ObjectId(roomId)
                    }
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

            const chatList = await ChatModel.aggregate(aggregation, {
                collation: { locale: 'en' },
            })
            const metaData = {
                totalRecords: chatList[0]?.metadata[0]?.total || 0,
                currentPage: page,
                recordPerPage: limit,
            }
            result = chatList.length ? chatList[0].data : []
            result.metaData = metaData
            return result
        } catch (e) {
            result.errmsg = e?.message
            return result
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
     * @description : this function is used to get user data
     * @param {*} body 
     * @returns 
     */
    findMemberOfRoom: async (body) => {
        let result = {}
        try {
            const { roomId } = body
            const aggregation = [
                {
                    $match: {
                        roomId: new ObjectId(roomId),
                        isDeleted: false,
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
                                    status: 1,
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
    /**
     * @description : this function is used to remove the members frm isnotseer array list
     * @param {*} messageObj 
     */
    isSeenMessage: async (messageObj)=>{
        try {
         const result =  await ChatModel.updateMany(
            { roomId: new ObjectId(messageObj.roomId)}, 
            { $pull: { "isNotSeen": messageObj?.userId }},
            );
        return result

        } catch (error) {
         return error    
        }
    }
}
