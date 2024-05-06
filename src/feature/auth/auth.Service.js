const UserService = require('../user/user.Service');
const { AUTH } = require('../../utils/responseMessage');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    signIn : async (object) => {
        let result  =  {}
        try {
        const { email , password  } = object
         const user =  await UserService.findByAttribute({ email: email , isDeleted: false });
         if(!user){
            result.errormsg = AUTH.USER_NOT_FOUND;
            return result;
         }
        
        const isMatched =  await bcrypt.compare(password, user.password);
        if(!isMatched){
            result.errormsg = PASSWORD_MISMATCH
            return result ;
        }
        delete user?.password;
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const jwtTokenObj = {   time: Date(), user: user }
        const token = jwt.sign(jwtTokenObj, jwtSecretKey , {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        const data =  await UserService.findById(user?._id);
        if(!data){
            result.errormsg = AUTH.USER_NOT_FOUND;;
            return result;
        }
        data.token = token;
         return result = data
        } catch (error) {
         return error;
        }
    },
    /**
     * @description This function is used to find the user by their id
     * @param {*} _id 
     * @returns 
     */

    findById: async (_id )=> {
        try {
         user = await UserModel.find({_id: _id})
         return user
        } catch (error) {
         return error
        }
    },
/**
 * @description This function is used to find the user by attributes
 * @param {*} data 
 * @returns 
 */
    findByAttribute: async ( data )=> {
        try {
         user = await UserModel.find({data})
         return user
        } catch (error) {
         return error
        }
    }
}
