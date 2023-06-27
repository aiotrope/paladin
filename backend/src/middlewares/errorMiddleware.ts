import { Request, Response, NextFunction } from 'express'
import createHttpError, { HttpError } from 'http-errors'

//import logger from '../utils/logger'

const endPoint404 = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404))
}

const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): object | void => {
  //logger.warn(req.path)
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
  if (error.message === 'Cannot use the email provided') {
    return res.status(403).json({ error: error.message })
  }

  if (error.message === 'Passwords do not match') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
const errorMiddleware = {
  endPoint404,
  errorHandler,
}

export default errorMiddleware
