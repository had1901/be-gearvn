
const db = require('../models/index.js')
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})



const productController = {
    getAll: async (req,res,next) => {
        try{
            const products = await db.Product.findAll({
                attributes: ['id', 'name', 'description', 'thumbnail', 'price', 'sale_price', 'flash_sale', 'sale_percent', 'stock_quantity', 'rating_count', 'category_id', 'brand_id'],
                include: [
                    { 
                        model: db.Brand,
                        attributes: ['id', 'name'] 
                    },
                    { 
                        model: db.Category,
                        attributes: ['id', 'tag', 'name', 'slug'] 
                    },
                ],
                logging: false,
                nest: true,
                raw: true,
            })   
            if(!products) {
                return res.status(400).json({
                    ms: 'No product',
                    ec: 1
                })
            } 
            return res.status(200).json({
                ms: 'Get all product',
                ec: 0,
                dt: products
            }) 
        } catch(e){
            return next(e)
        }
    },
    get: async (req,res,next) => {
        const { id } = req.body
        try{
            const product = await db.Product.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'description', 'thumbnail', 'price', 'sale_price', 'flash_sale', 'sale_percent', 'stock_quantity', 'rating_count', 'category_id', 'brand_id'],
                include: [
                    { 
                        model: db.Brand,
                        attributes: ['id', 'name'] 
                    },
                    { 
                        model: db.Category,
                        attributes: ['id', 'tag', 'name', 'slug'] 
                    },
                ],
                logging: false,
                nest: true,
                raw: true,
            })   
            if(!product) {
                return res.status(400).json({
                    ms: 'No product',
                    ec: 1
                })
            } 
            return res.status(200).json({
                ms: 'Get  product',
                ec: 0,
                dt: product
            }) 
        } catch(e){
            return next(e)
        }
    }
}

module.exports = productController