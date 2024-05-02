const Joi = require('joi');
module.exports = {
  createRoomSchema: Joi.object({
    name:Joi.string().required(),
    roomType:Joi.string().valid('public', 'private'),
    status: Joi.boolean().default(true),
  }),
  // update room schema
  updateRoomSchema: Joi.object({
  _id: Joi.string().required(),
   name:Joi.string().required(),
   roomType:Joi.string().valid('public', 'private'),
   status: Joi.boolean().default(true),
  }),
// add members in room 
  updateMemberSchema: Joi.object({
    roomId: Joi.string().required(),
    users:Joi.array().items(Joi.string().required())
    }),
// remove members from room
    deleteMemberSchema: Joi.object({
      roomId: Joi.string().required(),
      userId:Joi.string().required()
    }),
// get user list via room id
    getUserSchema : Joi.object({
      roomId: Joi.string().required()
    })
}
