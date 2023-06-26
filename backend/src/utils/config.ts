import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8080

const MONGO_URL_DEV = process.env.MONGO_URL_DEV || ''

const MONGO_URL_PROD = process.env.MONGO_URL_PROD || ''

const MONGO_URL_TEST = process.env.MONGO_URL_TEST || ''

const config = {
  port: PORT,
  mongo_url_dev: MONGO_URL_DEV,
  mongo_url_prod: MONGO_URL_PROD,
  mongo_url_test: MONGO_URL_TEST,
}

export default config
