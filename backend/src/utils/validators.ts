import Joi from 'joi'

const password_regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~?/`!@#$%^&*()\-_=+{};:,<.>])(?=.{8,})/

export const signupSchema = Joi.object()
  .keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string()
      .pattern(
        password_regex,
        'Password requires 8 characters with one lower, 1 uppercase letter, 1 number and 1 symbol'
      )
      .required(),
    confirm: Joi.string().valid(Joi.ref('password')).required().strict(),
  })
  .required()

export const signinSchema = Joi.object()
  .keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required(),
  })
  .required()
