import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8080

const MONGO_URL_DEV = process.env.MONGO_URL_DEV || ''

const MONGO_URL_PROD = process.env.MONGO_URL_PROD || ''

const MONGO_URL_TEST = process.env.MONGO_URL_TEST || ''

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || ''

const JWT_SECRET = process.env.JWT_SECRET || ''

const SESSION_SECRET = process.env.SESSION_SECRET || ''

const config = {
  port: PORT,
  mongo_url_dev: MONGO_URL_DEV,
  mongo_url_prod: MONGO_URL_PROD,
  mongo_url_test: MONGO_URL_TEST,
  google_client_id: GOOGLE_CLIENT_ID,
  google_client_secret: GOOGLE_CLIENT_SECRET,
  google_callback_url: GOOGLE_CALLBACK_URL,
  jwt_secret: JWT_SECRET,
  session_secret: SESSION_SECRET,
}

export default config
