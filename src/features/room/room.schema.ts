import Joi from 'joi';
export const createRoomSchema = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string().valid('public', 'private'),
  status: Joi.boolean().default(true)
});
// update room schema
export const updateRoomSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  roomType: Joi.string().valid('public', 'private'),
  status: Joi.boolean().default(true)
});
// add members in room
export const updateMemberSchema = Joi.object({
  roomId: Joi.string().required(),
  users: Joi.array().items(Joi.string().required())
});
// remove members from room
export const deleteMemberSchema = Joi.object({
  roomId: Joi.string().required(),
  userId: Joi.string().required()
});
// get user list via room id
export const getUserSchema = Joi.object({
  roomId: Joi.string().required()
});
