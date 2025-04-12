// const mongoose = require('mongoose')
import mongoose from 'mongoose'

// database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`connnected to database ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`DB Error`, error)
    }

}
// module.exports = connectDB 
export default connectDB