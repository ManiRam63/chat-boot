const UserModel = require('../../models/UserModel');
const { errorResponse, successResponse } = require('../../utils/responseIntercepter');
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

            if (result?.errmsg || result?.message) {

                let message = result.message ? result.message : result?.errmsg ? result?.errmsg : "Some error occurred while creating user"
                return errorResponse(res, message, 401, null)

            } else {
                return successResponse(res, message = "User created successfully.", 200, result)
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

            return successResponse(res, message = "users fetch successfully ", 200, data, metaData)
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
            return successResponse(res, message = "user fetch successfully ", 200, user)
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
            const result = await userService.updateUser(req.body)
            if (result?.errmsg) {
                let message = result?.errmsg ? result?.errmsg : " Some error occurred while updateing the user "
                return errorResponse(res, message, 401, null)
            } else {
                return successResponse(res, message = " User updated successfully.", 200, result)
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
                return errorResponse(res, "user id required", 400, null)
            }
            const user = await UserService.findById(id);
            if (!user) {
                return errorResponse(res, "user not found", 404, null)
            }
            const result = await userService.deleteUser(id)
            if (result?.errmsg) {
                let message = result?.errmsg ? result?.errmsg : " Some error occurred while deleting the user "
                return errorResponse(res, message, 401, null)
            } else {
                return successResponse(res, message = " User deleted successfully.", 200, result)
            }

        } catch (error) {
            return errorResponse(res, error?.message, 503, null)
        }
    }
};

