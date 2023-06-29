import config from '../utils/config'
import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

import { UserModel, User } from '../models/user'

export const checkAuthUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(createHttpError(401))
  } else {
    res.status(200).end()
    next()
  }
}

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    next(createHttpError(401))
  }
  next()
}

const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user

  const decoded = jwt.verify(token, config.jwt_secret)

  const currentUser = await UserModel.findOne({ email: req.user.email })
  if (!currentUser || !token || !decoded) {
    next(createHttpError(401))
  } else if (currentUser || token || decoded) {
    req.currentUser = currentUser

    req.user = decoded
  } else {
    next(createHttpError(401))
  }

  next()
}
