const UserService = require("../user/user.Service");
const { AUTH } = require("../../utils/responseMessage");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const filename = "auth.service.js";
module.exports = {
  signIn: async (object) => {
    let result = {};
    try {
      const { email, password } = object;
      const user = await UserService.findByAttribute({
        email: email,
        isDeleted: false,
      });
      if (!user) {
        result.error = AUTH.USER_NOT_FOUND;
        logger.error(result.error + filename);
        return result;
      }

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        result.error = PASSWORD_MISMATCH;
        logger.error(result.error + filename);
        return result;
      }
      delete user?.password;
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const jwtTokenObj = { time: Date(), user: user };
      const token = jwt.sign(jwtTokenObj, jwtSecretKey, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const data = await UserService.findById(user?._id);
      if (!data) {
        logger.error(result.error + filename);
        result.error = AUTH.USER_NOT_FOUND;
        return result;
      }
      data.token = token;
      return data;
    } catch (error) {
      logger.error(error + filename);
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
      return await UserModel.find({ _id: _id });
    } catch (error) {
      logger.error(error + filename);
      return error;
    }
  },
  /**
   * @description This function is used to find the user by attributes
   * @param {*} data
   * @returns
   */
  findByAttribute: async (data) => {
    try {
      return await UserModel.find({ data });
    } catch (error) {
      logger.error(error + filename);
      return error;
    }
  },
};
