const { errorResponse, successResponse } = require('../../utils/responseIntercepter');
const userService = require('../user/user.Service');
const { loginSchema } = require('./auth.Schema');
const authService = require('./auth.Service');
module.exports = {
    /**
     * @description : this function is used to create a token and  authenticate the user
     * @param {*} req 
     * @param {*} res 
     * @returns Success or Failure message
     */
    signIn : async (req, res) => {
        try {

            const validate = loginSchema.validate(req.body);

            if (validate.error) {

                return errorResponse(res, validate.error.message , 400 , null)
            }
            const result = await authService.signIn(req.body)
            if (result?.errormsg || result?.message) {

            let message = result.message ? result.message : result?.errormsg ? result?.errormsg : "Some error occurred"
               return errorResponse(res,message , 401  , null)
            }
            return successResponse(res , message = "login successfully" , 200 , result)

        } catch (error) {

            return errorResponse(res , error.message , 500  , null)
        }
    },
};

