import { Request, Response } from 'express'
require('express-async-errors')
import { HydratedDocument } from 'mongoose'
import bcrypt from 'bcrypt'
import * as z from 'zod'
import { fromZodError } from 'zod-validation-error'

import { UserModel, User } from '../models/user'
import { signupSchema } from '../utils/validators'

//import logger from '../utils/logger'

const getAll = async (_req: Request, res: Response) => {
  try {
    const users: User[] = await UserModel.find({})

    if (!users) throw Error('Problem fetching users')

    return res.status(200).json(users)
  } catch (err) {
    if (err instanceof Error) {
      throw Error(`${err.message}`)
    } else if (err instanceof z.ZodError) {
      const validationError = fromZodError(err)
      throw Error(validationError.toString())
    }
  }
}

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

export default {
  getAll,
  signup,
}
