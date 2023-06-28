import express from 'express'

import userController from '../controllers/user'

const router = express.Router()

router.post('/signup', userController.signup)

router.post('/signin', userController.signin)

router.get('/', userController.getAll)

export default router
