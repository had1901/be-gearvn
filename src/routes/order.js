const express = require('express')
const orderController = require('../controller/orderController.js')
const router = express.Router()


const orderRouter = (app) => {
    router.post('/create-order', orderController.create)
    router.post('/get-orders', orderController.getOrdersByUser)
    router.get('/get-all-order', orderController.getAll)
    router.get('/get-group-orders-date', orderController.getGroupByDate)
    router.post('/update-status', orderController.updateStatus)
    

    return app.use(router)
}
module.exports = orderRouter