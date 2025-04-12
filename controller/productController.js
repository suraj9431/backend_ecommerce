import productModel from '../models/productModel.js'
import getDataUri from '../utils/feature.js'
import cloudinary from 'cloudinary'
export const getAllProductController = async (req, res) => {
    const { keyword, category } = req.query
    try {
        const product = await productModel.find({
            name:
            {
                $regex: keyword || "",
                $options: "i",
            }

        })
        res.status(200).send({
            success: true, message: 'product fetched successfully',
            totalProduct: product.length, product
        })
    } catch (error) {
        res.status(500).send({
            success: false, message: 'error in getAllProductController api', error
        })
    }
}
export const getTopProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
        res.status(200).send({
            success: true,
            message: "top 3 products",
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false, message: 'error in getAllProductController api', error
        })
    }
}
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.send('product not found')
        }
        res.status(200).send({
            success: true, message: 'fetched product', product
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in getAllProductController api', error
        })
    }
}
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, stock, quantity } = req.body
        // console.log(name, description, price, stock, category, quantity)
        // if (!name || !description || !price || !stock || !category || !quantity) {
        //     return res.send('plz fill all fields')
        // }
        if (!req.file) {
            return res.send('plz provide images')
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        console.log(cdb.secure_url)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        await productModel.create({ name, description, price, stock, quantity, images: image })

        res.status(200).send({
            success: true, message: 'product created success'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, message: 'error in createProductController api', error
        })
    }
}
export const updateProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.send('plz send product id')
        }
        const { name, description, price, stock, category } = req.body
        //verify and update
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (category) product.category = category;
        await product.save();
        res.send({
            success: true, message: 'product updated'
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in updateProductController api', error
        })
    }
}
export const updateProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.send('plz send product id')
        }
        if (!req.file) {
            return res.send('send file')
        }
        const file = getDataUri(req.file)
        const cdb = cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        product.images.push(image)
        await product.save()
        res.status(200).send({
            success: true, message: 'image updated'
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in updateProductImageController api', error
        })
    }
}
export const deleteProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.send({
                success: false, message: 'product not found'
            })
        }
        //find image id
        const id = req.query.id

        if (!id) {
            return res.status(404).send({
                success: false, message: 'product image not found'
            })
        }
        let isExist = -1;
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) {
                isExist = index
            }
        });
        if (isExist === -1) {
            return res.status(404).send({
                success: false,
                message: 'Image not found in product images',
            });
        }
        //delete image
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

        product.images.splice(isExist, 1);
        await product.save()
        return res.status(200).send({
            success: true, message: 'image deleted successfully'
        })



    } catch (error) {
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in deleteProductImageController api', error
        })
    }
}


export const deleteProductController = async (req, res) => {
    try {
        // Find product by ID
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found',
            });
        }
        // Delete image from Cloudinary
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);

        }
        await product.deleteOne();
        return res.status(200).send({
            success: true,
            message: 'product deleted successfully',
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send({
                success: false,
                message: 'Invalid ID format',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in deleteProductImageController API',
            error: error.message,
        });
    }
};





export const productReviewController = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        // find product
        const product = await productModel.findById(req.params.id)
        //check previous review
        const alreadyReview = product.reviews.find((r) => r.user.toString() === req.user._id.toString())
        if (alreadyReview) {
            return res.status(400).send({
                success: false, message: 'product already reviewed'
            })
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        //passing review obj to review array
        product.reviews.push(review)
        //Number of review
        product.numReviews = product.reviews.length
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(200).send({
            success: true, message: 'review added'
        })
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send({
                success: false,
                message: 'Invalid ID format',
            });
        }
        res.status(500).send({
            success: false,
            message: 'Error in deleteProductImageController API',
            error: error.message,
        });
    }
}



