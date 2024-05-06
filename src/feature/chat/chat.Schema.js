const Joi = require('joi');
module.exports = {
  roomChatSchema: Joi.object({
    roomId:Joi.string().required(),
  }),

  addChatSchema: Joi.object({
    roomId:Joi.string().required(),
    senderId:Joi.string().required(),
    message:Joi.string().required(),
    messageType:Joi.string().valid('text','audio','image'),
  }),
}
