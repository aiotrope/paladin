import { PassportStatic } from 'passport'
import * as passportLocal from 'passport-local'
import bcrypt from 'bcrypt'

import { User, UserModel } from '../../models/user'

import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types'

import { Document, Types } from 'mongoose'

const LocalStrategy = passportLocal.Strategy

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
}

const verifyAuthCredentialsCallback = (
  email: never,
  password: string | Buffer,
  done: (
    arg0: null,
    arg1:
      | boolean
      | (Document<unknown, BeAnObject, User> &
          Omit<User & { _id: Types.ObjectId }, 'typegooseName'> &
          IObjectWithTypegooseFunction)
  ) => unknown
) => {
  UserModel.findOne({ email }).then((user) => {
    if (!user) {
      return done(null, false)
    } else {
      const isCorrectPassword = bcrypt.compareSync(
        password,
        user.hashedPassword
      )
      if (!isCorrectPassword) {
        return done(null, false)
      } else {
        return done(null, user)
      }
    }
  })
}

export const localStrategy = (passport: PassportStatic) => {
  passport.use(new LocalStrategy(customFields, verifyAuthCredentialsCallback))

  passport.serializeUser((user: User, done) => done(null, user.email))

  passport.deserializeUser((id, done) =>
    UserModel.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err))
  )
}
