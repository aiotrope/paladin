import Joi from 'joi'

const password_regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~?/`!@#$%^&*()\-_=+{};:,<.>])(?=.{8,})/

export const signupSchema = Joi.object()
  .keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string()
      .pattern(
        password_regex,
        'One lower & uppercase letter, 1 number and one symbols are allowed'
      )
      .required(),
    confirm: Joi.string().valid(Joi.ref('password')).required().strict(),
  })
  .required()
