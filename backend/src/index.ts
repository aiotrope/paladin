import config from './utils/config'
import express from 'express'
require('express-async-errors')
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

import middlewares from './utils/middlewares'
import dbConnection from './utils/db'
import logger from './utils/logger'

import indexRouter from './routes'

const app = express()

dbConnection()

app.use(express.static('../frontend/build'))

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  let options = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }
  app.use(cors(options))
}

app.use(cors())

app.use(helmet())

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
app.use(require('sanitize').middleware)
/* eslint-enable-next-line @typescript-eslint/no-var-requires */

app.use(mongoSanitize())

app.use(middlewares.loggingMiddleware)

app.use('/', indexRouter)

app.use(middlewares.endPoint404)

app.use(middlewares.errorHandler)

app.listen(config.port, () => {
  logger.debug(`Server is running on port ${config.port}`)
})
