import Joi from 'joi'

const password_regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~?/`!@#$%^&*()\-_=+{};:,<.>])(?=.{8,})/

const username_regex = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/

export const signupSchema = Joi.object()
  .keys({
    email: Joi.string().trim().required().email(),
    username: Joi.string()
      .pattern(
        username_regex,
        'Username requires 3 characters long with letters, numbers and special characters'
      )
      .trim()
      .required(),
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
