import { Request, Response, NextFunction } from 'express'
require('express-async-errors')
import createHttpError, { HttpError } from 'http-errors'

import logger from '../utils/logger'

const endPoint404 = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404))
}

const errorHandler = (
  error: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
): object | void => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: `${error.name}: ${error.message}`,
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message })
  }

  if (error.name === 'MongoServerError') {
    return res.status(500).json({ error: error.message })
  }

  if (error.name === 'TypeError') {
    return res.status(400).json({ error: error.message })
  }

  if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'UnauthorizedError'
  ) {
    return res
      .status(401)
      .json({ error: 'unauthorize: token maybe incorrect or missing!' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired!' })
  }

  if (error.message === 'Cannot use the email provided') {
    return res.status(403).json({ error: error.message })
  }

  if (error.message === 'Problem fetching users') {
    return res.status(422).json({ error: error.message })
  }

  if (error.message === 'Incorrect login credentials') {
    return res.status(401).json({ error: error.message })
  }

  next(error)
}
const errorMiddleware = {
  endPoint404,
  errorHandler,
}

export default errorMiddleware
