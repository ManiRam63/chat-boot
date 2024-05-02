const Joi = require('joi');
module.exports = {
  createUserSchema: Joi.object({
    isGuest: Joi.boolean().required().valid(true, false),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.alternatives().conditional('isGuest', {
      is: false, then: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
    }),
    password: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    firstname: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    firstname: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    lastname: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    phone: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    status: Joi.boolean().default(true),
  }),
  // update user schema  user data
  updateUserSchema: Joi.object({
    _id: Joi.string().required(),
    isGuest: Joi.boolean().required().valid(true, false),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.alternatives().conditional('isGuest', {
      is: false, then: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
    }),
    password: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    firstname: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    firstname: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    lastname: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    phone: Joi.alternatives().conditional('isGuest', { is: false, then: Joi.string().required() }),
    status: Joi.boolean().default(true),
  })
}
