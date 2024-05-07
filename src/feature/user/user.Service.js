const UserModel = require('../../models/UserModel');
const bcrypt = require('bcrypt');
const { USER } = require('../../utils/responseMessage');
const salt = bcrypt.genSaltSync(16);
module.exports = {
    create: async (data) => {
        try {
            const { password } = data
            if (password) {
                data.password = bcrypt.hashSync(password, salt);
            }
            const user = new UserModel(data);
             const result =  await user.save();
             delete result?._doc?.password;
             return result
        } catch (error) {
            return error;
        }
    },
    /**
     * @description This function is used to find the user by their id
     * @param {*} _id 
     * @returns 
     */
    findById: async (_id) => {
        try {
            user = await UserModel.findOne({ _id: _id }).lean()
            return user
        } catch (error) {
            return error
        }
    },
    /**
     * 
     * @param {*} data 
     * @returns 
     */
    findByAttribute: async (attributes) => {
        try {
            user = await UserModel.findOne(attributes, { password: 1 }).lean()
            return user
        } catch (error) {
            return error
        }
    },
    /**
     * @description This function is used to update the user with the id
     * @param {*} requestObj 
     * @returns success or error message
     */
    updateUser: async (requestObj) => {
        let result = {}
        try {
            const { _id, ...rest } = requestObj;
            const data = await UserModel.findByIdAndUpdate(_id, rest).lean()
            if (!data) {
                result.errmsg = USER.USER_NOT_FOUND
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
    deleteUser: async (id) => {
        let result = {}
        try {
            const data = await UserModel.findByIdAndUpdate(id, { isDeleted: true }).lean()
            if (!data) {
                result.errmsg = USER.SOME_ERROR_OCCURRED
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
                sortObj['username'] = 1
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
                        username: {
                            $regex: searchval,
                            $options: 'i',
                        },
                    },
                    {
                        email: {
                            $regex: searchval,
                            $options: 'i',
                        },
                    },
                    {
                        firstname: {
                            $regex: searchval,
                            $options: 'i',
                        },
                    },
                    {
                        lastname: {
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

            const usersList = await UserModel.aggregate(aggregation, {
                collation: { locale: 'en' },
            })
            const metaData = {
                totalRecords: usersList[0]?.metadata[0]?.total || 0,
                currentPage: page,
                recordPerPage: limit,
            }

            result.data = usersList.length ? usersList[0].data : []
            result.metaData = metaData
            return result
        } catch (e) {
            result.errmsg = e?.message
            return result
        }
    }
}
