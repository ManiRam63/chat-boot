import Joi from 'joi';
export const addChatSchema = Joi.object({
    roomId: Joi.string().required(),
    senderId: Joi.string().required(),
    message: Joi.string().required(),
    messageType: Joi.string().valid('text', 'audio', 'image')
});
export const RoomChatSchema = Joi.object({
    roomId: Joi.string().required()
});
