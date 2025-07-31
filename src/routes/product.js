const express = require('express')
const productController = require('../controller/productController.js')
const router = express.Router()
const upload = require('../middleware/uploadStorage.js')

const middlewareUpload = upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'collection', maxCount: 5 }, 
])

const productRouter = (app) => {
    router.get('/get-all-product', productController.getAll)
    router.post('/get-product', productController.getById)
    router.get('/get-product-type', productController.getByCategory)
    // router.post('/update-product', middlewareUpload, productController.updateProduct) // tạo và upload từ sever
    // router.post('/create-new-product', middlewareUpload, productController.createNewProduct)
    router.post('/client/update-product', middlewareUpload, productController.updateProduct)
    router.post('/client/create-new-product', middlewareUpload, productController.createNewProduct) // tạo và upload từ client
    router.delete('/delete-product/:id', productController.remove) 
    router.post('/search-product', productController.searchProducts) 


    return app.use('/api', router)
}
module.exports = productRouter