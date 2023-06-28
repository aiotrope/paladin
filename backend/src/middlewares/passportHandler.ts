import { Request } from 'express'
import config from '../utils/config'
//import passport from 'passport'
import { PassportStatic } from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import * as passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
//import * as googleAuth20 from 'passport-google-oauth20'

import { User, UserModel } from '../models/user'
import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types'
import { Document, Types } from 'mongoose'

//const GoogleAuth20Strategy = googleAuth20.Strategy

const LocalStrategy = passportLocal.Strategy

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret,
  passReqToCallback: true,
}

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
}

export const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      options,
      async (
        req: Request,
        payload: { email: never },
        done: (
          arg0: null,
          arg1:
            | boolean
            | (Document<unknown, BeAnObject, User> &
                Omit<User & { _id: Types.ObjectId }, 'typegooseName'> &
                IObjectWithTypegooseFunction)
        ) => void | PromiseLike<void>
      ) => {
        const user = await UserModel.findOne({ email: payload.email })
        if (user) {
          req.user = user // current user Obj

          return done(null, user)
        }

        return done(null, false)
      }
    )
  )
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

export const authenticateUserLocal = (passport: PassportStatic) => {
  passport.use(new LocalStrategy(customFields, verifyAuthCredentialsCallback))

  passport.serializeUser((user: User, done) => done(null, user.email))

  passport.deserializeUser((id, done) =>
    UserModel.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err))
  )
}

/* passport.use(
  new GoogleAuth20Strategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ googleId: profile.id })

      // If user doesn't exist creates a new user. (similar to sign up)
      if (!user) {
        const newUser: User = await UserModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
        })
        if (newUser) {
          done(null, newUser)
        }
      } else {
        done(null, user)
      }
    }
  )
)
 */
