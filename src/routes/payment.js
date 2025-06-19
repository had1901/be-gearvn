const express = require('express')
const cartController = require('../controller/cartController.js')
const router = express.Router()
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})

const dayjs = require('dayjs')
const querystring = require('qs')
const crypto = require("crypto")     

const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay')
const { v4: uuidv4 } = require('uuid')

const payment = (app) => {
    // router.post('/create_payment_url', (req, res, next) => {
    //     console.log('req', req.body)
    //     let ip  = req.headers['x-forwarded-for'] 
    //         || req.connection.remoteAddress 
    //         || req.socket.remoteAddress 
    //         || req.connection.socket.remoteAddress 
    //         || '127.0.0.1'
    
    //     if (ip === '::1') ip = '127.0.0.1'
    //     let vnp_url = process.env.VNP_URL
    //     let date = new Date()
    
    //     const now = dayjs()
    //     const createDate = now.format('YYYYMMDDHHmmss')
    //     const orderId = now.format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 10000)
    //     // let createDate = dayjs(date, 'yyyymmddHHmmss')
    //     // let orderId = dayjs(date, 'yyyymmddHHMMss') + Math.floor(Math.random() * 10000)
    //     let amount = req.body.amount
    //     let bankCode = req.body.bankCode
    //     let orderInfo = req.body.orderDescription
    //     let orderType = req.body.orderType
    //     let locale = req.body.language
    //     if(locale === null || locale === ''){
    //         locale = 'vn'
    //     }

    //     function sortObject(obj) {
    //         let sorted = {}
    //         let keys = Object.keys(obj).sort()
    //         for (let key of keys) {
    //           sorted[key] = obj[key]
    //         }
    //         return sorted
    //       }

    //     let vnp_Params = {}
    //     vnp_Params['vnp_Version'] = '2.1.0'
    //     vnp_Params['vnp_Command'] = 'pay'
    //     vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE
    //     // vnp_Params['vnp_Merchant'] = ''
    //     vnp_Params['vnp_Locale'] = locale
    //     vnp_Params['vnp_CurrCode'] = 'VND'
    //     vnp_Params['vnp_TxnRef'] = orderId
    //     vnp_Params['vnp_OrderInfo'] = orderInfo
    //     vnp_Params['vnp_OrderType'] = orderType
    //     vnp_Params['vnp_Amount'] = Number(amount) * 100
    //     vnp_Params['vnp_ReturnUrl'] = process.env.VNP_RETURN_URL
    //     vnp_Params['vnp_IpAddr'] = ip
    //     vnp_Params['vnp_CreateDate'] = createDate
    //     if(bankCode !== null && bankCode !== ''){
    //         vnp_Params['vnp_BankCode'] = bankCode
    //     }
    
    //     vnp_Params = sortObject(vnp_Params)
    //     let signData = querystring.stringify(vnp_Params, { encode: false })
    //     let hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET)
    //     let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex")
    //     vnp_Params['vnp_SecureHash'] = signed
    //     vnp_url += '?' + querystring.stringify(vnp_Params, { encode: true })
      
    //     console.log("HASH SECRET:", process.env.VNP_HASHSECRET)
    //     console.log("TMNCODE:", process.env.VNP_TMNCODE)
    //     console.log("RETURN URL:", process.env.VNP_RETURN_URL)
    //     console.log('Sorted Params:', vnp_Params)
    //     console.log('Sign Data:', signData)
    //     console.log('Your Hash:', signed)
        
    //     return res.json({ redirectUrl: vnp_url })
    // })

    
    
    router.post('/create-payment-url', (req, res, next) => {
        const vnpay = new VNPay({
            // Thông tin cấu hình bắt buộc
            tmnCode: process.env.VNP_TMNCODE,
            secureSecret: process.env.VNP_HASHSECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // Trường hợp url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)
            
            // Cấu hình tùy chọn
            testMode: true,                // Chế độ test
            hashAlgorithm: 'SHA512',      // Thuật toán mã hóa
            enableLog: true,              // Bật/tắt ghi log
            loggerFn: ignoreLogger,       // Hàm xử lý log tùy chỉnh
            
            // Tùy chỉnh endpoints cho từng phương thức API (mới)
            // Hữu ích khi VNPay thay đổi endpoints trong tương lai
            endpoints: {
                paymentEndpoint: 'paymentv2/vpcpay.html',          // Endpoint thanh toán
                queryDrRefundEndpoint: 'merchant_webapi/api/transaction', // Endpoint tra cứu & hoàn tiền
                getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list', // Endpoint lấy danh sách ngân hàng
            }
        })
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const txnRef = uuidv4().replace(/-/g, '')

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: 10000,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: `order_${txnRef}`,
            vnp_OrderInfo: `Thanh toan don hang order_${txnRef}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:5173/payment/vnpay-return',
            vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
            vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
            vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
        })
        return res.status(201).json({ redirectUrl: paymentUrl})
    })

    // router.get('/vnpay-return', (req, res, next) => {
    //     console.log('return-payment', req.query)
    //     return res.status(200).json({
    //         ms: 'Return payment',
    //         ec: 0,
    //         dt: req.query
    //     })
    // })
    return app.use('/payment', router)
}
module.exports = payment