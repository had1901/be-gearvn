const express = require('express')
const productController = require('../controller/productController.js')
const router = express.Router()


const productRouter = (app) => {
    router.get('/get-all', productController.getAll)


    return app.use('/api', router)
}
module.exports = productRouter