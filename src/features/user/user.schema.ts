import Joi from 'joi';
export const createUserSchema = Joi.object({
  isGuest: Joi.boolean().required().valid(true, false),
  username: Joi.string().alphanum().min(3).max(30).required(),
  firstname: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  lastname: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  email: Joi.when('isGuest', {
    is: false,
    then: Joi.string().required()
  }),
  password: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  phone: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  status: Joi.boolean().default(true)
});
// update user schema  user data
export const updateUserSchema = Joi.object({
  isGuest: Joi.boolean().required().valid(true, false),
  username: Joi.string().required(),
  firstname: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  lastname: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  email: Joi.when('isGuest', {
    is: false,
    then: Joi.string().required()
  }),
  password: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  phone: Joi.when('isGuest', { is: false, then: Joi.string().required() }),
  status: Joi.boolean().default(true)
});

export const userResetPassword = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
})

