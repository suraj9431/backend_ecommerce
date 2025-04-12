import orderModel from "../models/orderModel.js"
import productModel from "../models/productModel.js"

export const createOrderController = async (req, res) => {
    try {
        const { shippingInfo, orderItems, paymentMethod, paymentInfo, tax, itemPrice, shippingCharges, totalAmount } = req.body
        if (!shippingInfo || !orderItems || !paymentMethod || !tax || !itemPrice || !shippingCharges || !totalAmount) {
            return res.status(500).send({
                success: false, message: 'all fields r required'
            })
        }


        await orderModel.create({
            user: req.user._id, shippingInfo, orderItems, paymentMethod, tax, itemPrice, shippingCharges, totalAmount
        })
        //stock update
        for (let i = 0; i < orderItems.length; i++) {
            //find product
            const product = await productModel.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity;
            await product.save()

        }
        res.status(200).send({
            success: true, message: 'order created successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, message: 'error in order application', error
        })
    }
}
export const getMyOrderController = async (req, res) => {
    try {

        const orders = await orderModel.find({ user: req.user._id })
        if (!orders) {
            return res.status(500).send({
                success: true, message: "no order found",

            })
        }
        console.log(orders)
        res.status(200).send({
            success: true,
            message: "your order are:",
            totalOrder: orders.length,
            orders
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in order application', error
        })
    }
}
export const singleOrderDetailsController = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
        if (!order) {
            return res.status(500).send({
                success: false, message: "order not found"
            })
        }
        res.status(200).send({
            success: true, message: "order fetched", order
        })
    }

    catch (error) {
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in singleOrderDetailsController api', error
        })
    }
}
//Admin part
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).send({
            success: true, message: 'all order data:', totalorder: orders.length, orders
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in getAllOrdersController', error
        })
    }
}

export const changeOrderStatusController = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
        if (!order) {
            return res.status(404).send({
                success: false, message: 'order not found'
            })
        }
        if (order.orderStatus === 'processing') order.orderStatus = 'shipped'
        else if (order.orderStatus === 'shipped') {
            order.orderStatus = 'delivered'
            order.deliveredAt = Date.now()
        } else {
            return res.status(500).send({
                success: false, message: "order already delivered"
            })
        }
        await order.save()
        res.status(200).send({
            success: true, message: "order status updated"
        })

    } catch (error) {
        if (error.name === "CastError") {
            return res.send('invalid id')
        }
        res.status(500).send({
            success: false, message: 'error in singleOrderDetailsController api', error
        })
    }
}

