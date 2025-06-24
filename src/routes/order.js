const express = require('express')
const orderController = require('../controller/orderController.js')
const router = express.Router()


const orderRouter = (app) => {
    router.post('/create-order', orderController.create)
    router.post('/get-orders', orderController.getAll)
    

    return app.use(router)
}
module.exports = orderRouter