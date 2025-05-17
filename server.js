import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

// config dotenv
dotenv.config()
connectDB()

// config cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})


//? routes
// import testRoutes from './routes/testRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
//? middelware
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/cat', categoryRoutes)
app.use('/api/v1/order', orderRoutes)
// !first api
app.get("/", (req, res) => {
    return res.send('hello gentlemen this is backend api of ecommerce project')
})

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`server is running on port ${port}`)

})


