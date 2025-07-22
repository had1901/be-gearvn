
const { Sequelize } = require('sequelize')
const db = require('../models/index.js')
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})


const orderController = {
    create: async (req,res,next) => {
        const { userId, carts, genre, name, total, orderCode, phone, cityCode, districtCode, wardCode, houseNumber, methodPay } = req.body
        console.log(req.body)
        try{
            if(userId) {
                const fullAddress = `${houseNumber} - ${wardCode} - ${districtCode} - ${cityCode}`
                const createOrder = await db.Order.create({
                        user_id: userId,
                        order_code: orderCode,
                        total_price: total,
                        ship_cod: 0,
                        discount: 0,
                        username: name,
                        phone,
                        genre,
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
    getOrdersByUser: async (req,res,next) => {
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
    },
    getAll: async (req,res,next) => {
        try{
            const orders = await db.Order.findAll({ 
                include: [
                    { 
                        model: db.Order_detail,
                        attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'discount', 'status'],
                        include: [
                            {
                                model: db.Product
                            }
                        ] 
                    },
                    { 
                        model: db.User,
                    },

                ],
                order: [
                    [
                        // Nếu status là 'pending' thì trả về 0 (ưu tiên lên đầu), còn lại là 1
                        Sequelize.literal(`
                            CASE 
                                WHEN status_payment = 'pending' THEN 0  
                                WHEN status_payment = 'completed' THEN 1
                                ELSE 2 
                            END`
                        ),
                        'ASC'
                    ],
                    ['createdAt', 'DESC'], // Sau đó sắp xếp tiếp theo thời gian tạo mới nhất
                ]
                // nest: true, 
            })
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
    },
    getGroupByDate: async (req,res,next) => {
        try{
            const orders = await db.Order.findAll({ 
                attributes: [
                    'id',
                    'user_id',
                    'order_code',
                    'total_price',
                    'ship_cod',
                    'discount',
                    'shipping_address',
                    'pay_method',
                    'status_payment',
                    'status_transpost',
                    [Sequelize.fn('DATE', Sequelize.col('Order.createdAt')), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('Order.id')), 'totalOrders']
                ],
                group: [Sequelize.fn('DATE', Sequelize.col('Order.createdAt'))],
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
    },
    updateStatus: async (req,res,next) => {
        const { id, status_payment, status_transpost } = req.body

        if(id) {
            try{
                const updatedStatus = await db.Order.update(
                { 
                    status_payment,
                    status_transpost
                },
                { where: { id } },
            )
                if(!updatedStatus) {
                    return res.status(400).json({
                        ms: 'Cập nhật thất bại',
                        ec: 1,
                    }) 
                    
                }
                return res.status(200).json({
                        ms: 'Cập nhật trạng thái thành công',
                        ec: 0,
                    }) 
            }catch(e){
                console.log(e)
                return next(e)
            }
        }
    },
}
module.exports = orderController