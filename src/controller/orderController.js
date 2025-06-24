
const db = require('../models/index.js')
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})


const orderController = {
    create: async (req,res,next) => {
        const { userId, carts, genre, name, total, orderCode, phone, cityCode, districtCode, wardCode, houseNumber, methodPay } = req.body
        try{
            if(userId) {
                const fullAddress = `${houseNumber} - ${wardCode} - ${districtCode} - ${cityCode}`
                const createOrder = await db.Order.create({
                        user_id: userId,
                        order_code: orderCode,
                        total_price: total,
                        ship_cod: 0,
                        discount: 0,
                        shipping_address: fullAddress,
                        pay_method: methodPay,
                        status_payment: 'pending',
                        status_transpost: 'pending'
                    },
                )
                if(createOrder) {
                    const orderDetails = carts.map(item => ({
                        order_id: createOrder.dataValues.id, // gán id đơn hàng vừa tạo
                        product_id: item.product.id,
                        quantity: item.quantity,
                        price: item.product.sale_price,
                        discount: 0,
                        status: createOrder.dataValues.status_payment
                    }))
                    await db.Order_detail.bulkCreate(orderDetails)
                    return res.status(200).json({
                        ms: 'Create order and create order_detail',
                        ec: 0,
                        dt: null
                    }) 
                }
            }
        }catch(e){
            return next(e)
        }
        
        
    
    },
    getAll: async (req,res,next) => {
        const { userId } = req.body
        if(userId) {
            try{
                const orders = await db.Order.findAll({ 
                    where: { user_id: userId },
                    include: [
                        { 
                            model: db.Order_detail,
                            attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'discount', 'status'],
                            include: [
                                {
                                    model: db.Product
                                }
                            ] 
                        }
                    ],
                    nest: true, 
                })
                console.log(orders)
                if(orders.length > 0) {
                    return res.status(200).json({
                        ms: 'Get all order',
                        ec: 0,
                        dt: orders
                    }) 
                }
                return res.status(204).json({
                    ms: 'Not found orders',
                    ec: 0,
                }) 
            }catch(e){
                return next(e)
            }
        }
        
        
    
    }
}

module.exports = orderController