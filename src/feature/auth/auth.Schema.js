const Joi = require('joi');
module.exports = {
  loginSchema : Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required(),
  })
}