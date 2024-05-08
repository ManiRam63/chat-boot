const logger = require("../../utils/logger");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseInterceptor");
const { AUTH } = require("../../utils/responseMessage");
const { loginSchema } = require("./auth.Schema");
const authService = require("./auth.Service");
const filename = " :- in auth.controller.js";
module.exports = {
  /**
   * @description : this function is used to create a token and  authenticate the user
   * @param {*} req
   * @param {*} res
   * @returns Success or Failure message
   */
  signIn: async (req, res) => {
    try {
      const validate = loginSchema.validate(req.body);

      if (validate.error) {
        logger.error(validate.error + filename);
        return errorResponse(res, validate.error.message, 400, null);
      }
      const result = await authService.signIn(req.body);
      if (result?.error || result?.message) {
        let message =
          result.message || result?.error || AUTH.SOME_ERROR_OCCURRED;
        logger.error(message + filename);
        return errorResponse(res, message, 401, null);
      }
      return successResponse(res, AUTH.LOGIN_SUCCESSFULLY, 200, result);
    } catch (error) {
      logger.error(error.message + filename);
      return errorResponse(res, error.message, 500, null);
    }
  },
};
