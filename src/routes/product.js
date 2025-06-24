const express = require('express')
const productController = require('../controller/productController.js')
const router = express.Router()


const productRouter = (app) => {
    router.get('/get-all', productController.getAll)
    router.post('/get-product', productController.get)


    return app.use('/api', router)
}
module.exports = productRouter