const express = require('express')
const categoryController = require('../controller/categoryController.js')
const router = express.Router()


const categoryRouter = (app) => {

    router.get('/admin/categories', categoryController.getAll)
    // router.get('/admin/read-accounts/:id', authController.readById)
    // router.post('/admin/create-account', authController.create)
    // router.put('/admin/update-account', authController.update)
    // router.delete('/admin/delete-account/:id', authController.remove)


    return app.use('/auth', router)
}
module.exports = categoryRouter