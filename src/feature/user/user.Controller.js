const { errorResponse, successResponse } = require('../../utils/responseInterceptor');
const { USER } = require('../../utils/responseMessage');
const { createUserSchema, updateUserSchema } = require('./user.Schema');
const userService = require('./user.Service');
const UserService = require('./user.Service');
module.exports = {
    /**
     * @description : this function is used to create a new user
     * @param {*} req 
     * @param {*} res 
     * @returns Success or Failure message
     */
    create: async (req, res) => {
        // validate user schema
        try {
            const validate = createUserSchema.validate(req.body);
            if (validate.error) {
                return errorResponse(res, validate.error.message, 400, null)
            }
            const result = await UserService.create(req.body)

            if (result?.error || result?.message) {

                let message = result.message ? result.message : result?.error ? result?.error : USER.SOME_ERROR_OCCURRED
                return errorResponse(res, message, 401, null)

            } else {
                return successResponse(res, USER.USER_CREATED_SUCCESSFULLY, 200, result)
            }

        } catch (error) {
            return errorResponse(res, error.message, 500, null)
        }
    },
    /**
     * @description : this function is used to get all user data
     * @param {*} req 
     * @param {*} res 
     */
    findAll: async (req, res) => {
        try {
            const { data, metaData } = await userService.list(req?.query)

            return successResponse(res, USER.USER_FETCH_SUCCESSFULLY, 200, data, metaData)
        } catch (error) {
            return errorResponse(res, error.message, 500, null)
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
            const user = await UserService.findById(req?.params?.id);
            if(!user) {
                return errorResponse(res, USER.USER_NOT_FOUND, 404, null)
            }
            return successResponse(res, USER.USER_FETCH_SUCCESSFULLY, 200, user)
        } catch (error) {
            return errorResponse(res, error.message, 500, null)
        }
    },
    /**
     * @description : this function is used to update user via id
     * @param {*} req 
     * @param {*} res 
     * @returns updated object of user
     */
    update: async (req, res) => {
        try {
            const validate = updateUserSchema.validate(req.body);
            if (validate.error) {
                return errorResponse(res, validate.error.message, 400, null)
            }
            // checking if user already exists or not 
            const user = await UserService.findById(req?.body?.id);
            if(!user) {
                return errorResponse(res, USER.USER_NOT_FOUND, 404, null)
            }
            const result = await userService.updateUser(req.body)
            if (result?.error) {
                let message = result?.error ? result?.error : USER.SOME_ERROR_OCCURRED
                return errorResponse(res, message, 401, null)
            } else {
                return successResponse(res, USER.USER_UPDATED_SUCCESSFULLY, 200, result)
            }
        } catch (error) {
            return errorResponse(res, error?.message, 401, null)
        }
    },
    /**
     * @discription this function is used to delete the user
     * @param {*} req 
     * @param {*} res 
     * @returns success or error message 
     */
    delete: async (req, res) => {
        try {
            const id = req?.params?.id;
            if (!id) {
                return errorResponse(res, USER.USER_ID_REQUIRED, 400, null)
            }
            const user = await UserService.findById(id);
            if (!user) {
                return errorResponse(res, USER.USER_NOT_FOUND, 404, null)
            }
            const result = await userService.deleteUser(id)
            if (result?.error) {
                let message = result?.error ? result?.error : USER.SOME_ERROR_OCCURRED
                return errorResponse(res, message, 401, null)
            } else {
                return successResponse(res, USER.USER_DELETED_SUCCESSFULLY, 200, result)
            }

        } catch (error) {
            return errorResponse(res, error?.message, 503, null)
        }
    }
};

