import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "user",
        required: [true, 'user required']
    },
}, { timestamps: true }
)






const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name is required']
    },
    description: {
        type: String,
        required: [true, ' product description is required']
    },
    price: {
        type: Number,
        required: [true, 'product price is required']
    },
    stock: {
        type: Number,
        required: [true, 'product stock is required']
    },
    quantity: {
        type: Number,
        // required: [true, 'product quantity is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    images: [

        {
            public_id: { type: String },
            url: { type: String }
        }

    ],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true }

)




const productModel = mongoose.model('product', productSchema)
export default productModel;