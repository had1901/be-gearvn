

const db = require('../models/index.js')
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})




const cartController = {
    update: async (req,res,next) => {
        const { productId, type, userId } = req.body
        try {
            const existProduct = await db.Cart_item.findOne({
                where: { product_id: productId, user_id: userId },
            })

            if(existProduct) {
                if(type === 'plus') {
                    existProduct.quantity += 1
                    await existProduct.save()
                    return res.status(200).json({
                        ms: 'Cộng sản phẩm',
                        ec: 0,
                        dt: existProduct
                    })
                } else if(type === 'down') {
                    existProduct.quantity -= 1
                    await existProduct.save()
                    return res.status(200).json({
                        ms: 'Trừ sản phẩm',
                        ec: 0,
                        dt: existProduct

                    })
                }
            }
            console.log('exist', existProduct)
        } catch(e) {
            return next(e)
        }

        
    },
    add: async (req,res,next) => {
        const { product, user, quantity = 1 } = req.body
        // console.log(req.body)
        try {
            const existingProduct = await db.Cart_item.findOne({
                where: { 
                    product_id: product.id, 
                    user_id: user.id, 
                },
            })
            console.log('exist', existingProduct)
            if(existingProduct) {
                // existingProduct.quantity += quantity
                // await existingProduct.save()
                await db.Cart_item.increment('quantity', {
                    by: quantity,
                    where: {
                      user_id: user.id,
                      product_id: product.id
                    }
                })
                return res.status(200).json({
                    ms: 'Tăng số lượng thành công',
                    ec: 0
                })
            } else {
                await db.Cart_item.create({ 
                    user_id: user.id,
                    product_id: product.id,
                    quantity
                })
                return res.status(201).json({
                    ms: 'Thêm sản phẩm thành công',
                    ec: 0
                })
            }
        } catch(e) {
            return next(e)
        }
    }, 
    getAll: async (req,res,next) => {
        const { id } = req.body
        if(id) {
            try{
                const cartItem = await db.Cart_item.findAll({
                    where: { user_id: id },
                    attributes: ['id', 'user_id', 'quantity'],
                    include: [
                        {
                          model: db.Product,
                          as: 'product', 
                          attributes: ['id', 'description', 'thumbnail', 'name', 'price', 'sale_price', 'flash_sale', 'sale_percent', 'stock_quantity', 'rating_count', 'brand_id', 'category_id']
                        }
                    ],
                    nest: true,
                    raw:true
                })
                // console.log(cartItem)
    
                if(!cartItem.length) {
                    return res.status(200).json({
                        ms: 'Giỏ hàng trống',
                        ec: 0,
                    })
                }
                return res.status(200).json({
                    ms: 'Get all cart',
                    ec: 0,
                    dt: cartItem
                })
            }catch(e) {
                return next(e)
            }
        }
        
    },
    delete: async (req,res,next) => {
        const { productId } = req.body
        // console.log(req.body)
        try {
            const existProduct = await db.Cart_item.findOne({
                where: { product_id: productId },
            })
            if(existProduct) {
                await db.Cart_item.destroy({
                    where: { product_id: productId },
                })
                return res.status(200).json({
                    ms: 'Xóa thành công',
                    ec: 0
                })
            }
        } catch(e) {
            return next(e)
        }

        
    },
    deleteAll: async (req,res,next) => {
        const { userId } = req.body
        try {
            const existCartItem = await db.Cart_item.findAll({
                where: { user_id: userId },
            })
            console.log(existCartItem)
            if(existCartItem.length > 0) {
                await db.Cart_item.destroy({
                    where: { user_id: userId },
                })
                return res.status(200).json({
                    ms: 'Xóa thành công',
                    ec: 0
                })
            }
            return res.status(200).json({
                ms: 'Không có gì để xóa',
                ec: 0
            })
        } catch(e) {
            return next(e)
        }
    },
}

module.exports = cartController