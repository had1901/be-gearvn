const express = require('express')
const cartController = require('../controller/cartController.js')
const router = express.Router()


const cartRouter = (app) => {
    router.post('/update-cart', cartController.update)
    router.post('/add-cart', cartController.add)
    router.post('/get-all-cart', cartController.getAll)
    router.post('/delete-cart', cartController.delete)
    router.post('/delete-all-cart', cartController.deleteAll)
    

    return app.use(router)
}
module.exports = cartRouter