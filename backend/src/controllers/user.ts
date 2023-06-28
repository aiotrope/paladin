import config from '../utils/config'
import { Request, Response } from 'express'
require('express-async-errors')
import { HydratedDocument } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UserModel, User } from '../models/user'
import { signupSchema, signinSchema } from '../utils/validators'

//import logger from '../utils/logger'

/**
 * @desc return an array of users objects with id, email, hashedPassword,
 * isStaff and timestamps
 */

const getAll = async (_req: Request, res: Response) => {
  try {
    const users: User[] = await UserModel.find({})

    if (!users) throw Error('Problem fetching users')

    return res.status(200).json(users)
  } catch (err) {
    if (err instanceof Error) {
      return res.status(422).json({ error: err.message })
    }
  }
}

/**
 * @desc create new user with request body of email, password and confirm
 * @return user object - id, email, hashedPassword, isStaff and timestamps
 */

const signup = async (req: Request, res: Response) => {
  const foundUser = await UserModel.findOne({ email: req.body.email })

  if (foundUser) throw Error('Cannot use the email provided')

  try {
    const validData = await signupSchema.validateAsync(req.body)

    if (validData.error) {
      return res.status(400).json({ error: validData.error.details.message })
    } else {
      const saltRounds = 10

      const hashed = await bcrypt.hash(req.body.password, saltRounds)

      const user: HydratedDocument<User> = new UserModel({
        email: req.body.email,
        hashedPassword: hashed,
      })

      await user.save()

      return res.status(201).json(user)
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(422).json({ error: err.message })
    }
  }
}

/**
 * @desc to send auth credentials - email & password
 * @return access (token) and user's email
 */

const signin = async (req: Request, res: Response) => {
  let { email, password } = req.body

  const validData = await signinSchema.validateAsync(req.body, {
    abortEarly: true,
  })

  if (validData.error) {
    return res.status(400).json({ error: validData.error.details.message })
  }

  try {
    const user = await UserModel.findOne({ email })

    const correctPassword =
      user === null
        ? false
        : await bcrypt.compare(password, user.hashedPassword)

    if (!(user && correctPassword)) throw Error('Incorrect login credentials')

    const payload = {
      email: user.email,
      id: user.id,
    }

    const token = jwt.sign(payload, config.jwt_secret, { expiresIn: '1h' })

    res.status(200).json({ access: token, email: payload.email })
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message })
    }
  }
}

export default {
  getAll,
  signup,
  signin,
}
