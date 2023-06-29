import config from '../../utils/config'
import { Request } from 'express'
import { PassportStatic } from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types'

import { Document, Types } from 'mongoose'

import { User, UserModel } from '../../models/user'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret,
  passReqToCallback: true,
}

export const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      options,
      async (
        req: Request,
        payload: { id: string; email: string },
        done: (
          arg0: null,
          arg1:
            | boolean
            | (Document<unknown, BeAnObject, User> &
                Omit<User & { _id: Types.ObjectId }, 'typegooseName'> &
                IObjectWithTypegooseFunction)
        ) => void | PromiseLike<void>
      ) => {
        const user = await UserModel.findOne({
          id: payload.id,
          email: payload.email,
        })
        if (user) {
          req.user = user

          return done(null, user)
        }

        return done(null, false)
      }
    )
  )
}
