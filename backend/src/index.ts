import config from './utils/config'
import express from 'express'
require('express-async-errors')
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import passport from 'passport'

import dbConnection from './utils/db'
import loggingMiddleware from './middlewares/loggingMiddleware'
import errorMiddleware from './middlewares/errorMiddleware'
import {
  jwtStrategy,
  authenticateUserLocal,
} from './middlewares/passportHandler'
import logger from './utils/logger'

import userRouter from './routes/user'

const app = express()

dbConnection()

jwtStrategy(passport)

authenticateUserLocal(passport)

app.use(express.static('../frontend/build'))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  let options = {
    origin: 'http://127.0.0.1:5173',
    optionsSuccessStatus: 200,
  }
  app.use(cors(options))
}

app.use(cors())

app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize())

app.use(passport.session())

app.use(helmet())

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
app.use(require('sanitize').middleware)
/* eslint-enable-next-line @typescript-eslint/no-var-requires */

app.use(mongoSanitize())

app.use(loggingMiddleware.logging)

app.use('/api/user', userRouter)

app.use(errorMiddleware.endPoint404)

app.use(errorMiddleware.errorHandler)

app.listen(config.port, () => {
  logger.debug(`Server is running on port ${config.port}`)
})
