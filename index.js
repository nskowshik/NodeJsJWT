const express = require('express')
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = 3000

// Import statement
const authRouter = require('./routes/auth')
const customerRouter = require('./routes/customer')
const orderRouter = require('./routes/order')
const productRouter = require('./routes/product')
dotenv.config();

global.__basePath = __dirname
// DB Connection

mongoose.connect(process.env.DB_CONNECTION_STRING , { useNewUrlParser : true } , () => {
    console.log('Connected to database')
})

app.use(express.json())

app.use('/task/user',authRouter)
app.use('/task/customer',customerRouter)
app.use('/task/orders' , orderRouter)
app.use('/task/product',productRouter)

app.listen(PORT , () => console.log(`App started on PORT ${PORT}`))