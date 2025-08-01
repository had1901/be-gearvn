const express = require('express')
const authController = require('../controller/authController.js')
const verifyToken = require('../middleware/verifyAccessToken.js')
const router = express.Router()


const userRouter = (app) => {
    router.post('/login', authController.login)
    router.post('/google-login', authController.googleLogin)
    router.post('/register', authController.register)
    router.post('/update-profile', verifyToken, authController.updateProfile)
    router.get('/profile', verifyToken, authController.profile)
    router.post('/refresh-token', authController.refreshToken)
    router.post('/logout', authController.logout)

    router.get('/admin/read-accounts', authController.read)
    router.get('/admin/read-accounts/:id', authController.readById)
    router.post('/admin/create-account', authController.create)
    router.put('/admin/update-account', authController.update)
    router.delete('/admin/delete-account/:id', authController.remove)


    return app.use('/auth', router)
}
module.exports = userRouter