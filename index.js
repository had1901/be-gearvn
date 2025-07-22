const express =require('express')
const cors =require('cors')
const cookieParser =require('cookie-parser')
const bodyParser = require('body-parser')
const connectDatabase =require('./src/connect/index.js')
const dotenv = require('dotenv')
const renameFiles =require('./src/middleware/renameFiles.js')
const userRouter =require('./src/routes/user.js')
const cartRouter =require('./src/routes/cart.js')
const productRouter =require('./src/routes/product.js')
const paymentRouter =require('./src/routes/payment.js')
const orderRouter =require('./src/routes/order.js')
const handleError = require('./src/middleware/handleError.js')
const categoryRouter = require('./src/routes/category.js')

const app = express()
const port = 8888

const environment = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${environment}` })

console.log('Môi trường -', environment)

// connect database
connectDatabase()

// middleware
const allowedOrigins = ['http://localhost:5173', 'https://your-production-site.com', 'https://gearvn-rust.vercel.app']
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            console.log('Nguồn: ', origin)
            callback(new Error('Bị chặn bởi CORS', origin))
        }
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(renameFiles)


userRouter(app)
cartRouter(app)
productRouter(app)
paymentRouter(app)
orderRouter(app)
categoryRouter(app)

app.get('/', (req, res) => {
    res.json({
        ms: 'Hello API GearVN',
        environment: process.env.NODE_ENV,
        database: process.env.DATABASE_NAME,

    })
})




app.use(handleError)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})