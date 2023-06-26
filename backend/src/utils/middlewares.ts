import { Request, Response, NextFunction } from 'express'
import createHttpError, { HttpError } from 'http-errors'
import morgan, { StreamOptions } from 'morgan'
import logger from './logger'

const stream: StreamOptions = {
  write: (message) => logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV || 'development'

  return env !== 'development'
}

const loggingMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
)

const endPoint404 = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404))
}

const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): object | void => {
  //logger.warn(error.message)
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
    return res.status(400).json({
      error: `duplicate username ${req.body.username} cannot be registered!`,
    })
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

  if (error.message === 'Problem fetching patients list!') {
    return res.status(400).json({ error: error.message })
  }

  if (error.message === 'Problem fetching diagnoses list!') {
    return res.status(400).json({ error: error.message })
  }
  if (error.message === '"name" is not allowed to be empty') {
    return res.status(400).json({ error: error.message })
  }
  if (error.message === '"occupation" is not allowed to be empty') {
    return res.status(400).json({ error: error.message })
  }

  if (error.message === '"ssn" is not allowed to be empty') {
    return res.status(400).json({ error: error.message })
  }

  if (error.message === '"dateOfBirth" is not allowed to be empty') {
    return res
      .status(400)
      .json({ error: 'Date of birth is not allowed to empty!' })
  }

  if (error.message === '"gender" must be one of [male, female, other]') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
const middlewares = {
  loggingMiddleware,
  endPoint404,
  errorHandler,
}

export default middlewares
