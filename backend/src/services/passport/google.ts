import config from '../../utils/config'
import { Request } from 'express'
import { PassportStatic } from 'passport'
import { Strategy } from 'passport-google-oauth20'

import { UserModel, User } from '../../models/user'
import logger from '../../utils/logger'

export const googleStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: config.google_callback_url,
        passReqToCallback: true,
      },
      async (req: Request, accessToken, refreshToken, profile, done) => {
        const user: User = await UserModel.findOne({ googleId: profile.id })
        if (!user) {
          const newUser = await UserModel.create({
            email: profile.emails?.[0].value,
            username: profile.displayName,
            googleId: profile.id,
          })

          if (newUser) {
            req.user = newUser

            logger.warn({ accessToken, refreshToken, newUser })
            return done(null, newUser)
          }
        }
        if (user && user[0]) {
          req.user = user
          req.accessToken = accessToken
          return done(null, user && user[0])
        }
      }
    )
  )
}
