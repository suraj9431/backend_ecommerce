import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createController = async (req, res) => {
    try {
        const { category } = req.body;
        if (!category) {
            return res.status(500).send({
                success: false, message: ' plx provide category name'
            })
        }
        await categoryModel.create({ category })
        res.status(200).send({
            success: true, message: `${category} is created`
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, message: 'error in createController api'
        })
    }

}
export const getAllCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find()

        res.status(200).send({
            success: true, message: 'fetched successfully', totalcat: category.length, category
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, message: 'error in get-AllController api'
        })
    }
}
export const deleteCategoryController = async (req, res) => {
    try {
        console.log(req.params.id)
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(500).send({
                success: false, message: 'category not found'
            })
        }
        //find product with this category id
        const products = await productModel.find({ category: category._id })
        //update product category
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            product.category = undefined
            await product.save()

        }
        //save
        await category.deleteOne()
        res.status(200).send({
            success: true, message: 'deleted successfully'
        })


    } catch (error) {
        console.log(error)
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in deleteProductImageController api', error
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        console.log(req.params.id)
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(500).send({
                success: false, message: 'category not found'
            })
        }
        const { updatedCategory } = req.body
        //find product with this category id
        const products = await productModel.find({ category: category._id })
        //update product category
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            product.category = updatedCategory
            await product.save()

        }
        if (updatedCategory) category.category = updatedCategory;
        //save
        await category.save()
        res.status(200).send({
            success: true, message: 'updated category'
        })


    } catch (error) {
        console.log(error)
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in updatecategoryController api', error
        })
    }
}