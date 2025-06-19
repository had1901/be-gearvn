const express = require('express')
const authController = require('../controller/authController.js')
const verifyToken = require('../middleware/verifyAccessToken.js')
const router = express.Router()


const userRouter = (app) => {
    router.post('/login', authController.login)
    router.post('/google-login', authController.googleLogin)
    router.post('/register', authController.register)
    router.get('/profile', verifyToken, authController.profile)
    router.post('/refresh-token', authController.refreshToken)
    router.post('/logout', authController.logout)


    return app.use('/auth', router)
}
module.exports = userRouter