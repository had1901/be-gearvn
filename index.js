const express =require('express')
const cors =require('cors')
const cookieParser =require('cookie-parser')
const connectDatabase =require('./src/connect/index.js')
const dotenv = require('dotenv')
dotenv.config()
const renameFiles =require('./src/middleware/renameFiles.js')
const userRouter =require('./src/routes/user.js')
const cartRouter =require('./src/routes/cart.js')
const productRouter =require('./src/routes/product.js')
const paymentRouter =require('./src/routes/payment.js')
const orderRouter =require('./src/routes/order.js')
const handleError = require('./src/middleware/handleError.js')

const app = express()
const port = 8888

// connect database
connectDatabase()

// middleware
const allowedOrigins = ['http://localhost:5173', 'https://your-production-site.com']
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use(renameFiles)


userRouter(app)
cartRouter(app)
productRouter(app)
paymentRouter(app)
orderRouter(app)

app.get('/', (req, res) => {
    res.json('Hello')
})




app.use(handleError)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})