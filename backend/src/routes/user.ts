import express, { Request, Response } from 'express'
import passport from 'passport'

import userController from '../controllers/user'
import logger from '../utils/logger'

const router = express.Router()

const successLoginUrl = 'http://127.0.0.1:5173/login/success'
const errorLoginUrl = 'http://127.0.0.1:5173/login/error'

router.post('/signup', userController.signup)

router.post('/signin', userController.signin)

router.get('/', userController.getAll)

router.get(
  '/google/login',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Try to login again later!',
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req: Request, res: Response) => {
    logger.debug('User: ', req.user)
    res.send('Thank you for signing in!')
  }
)

export default router
