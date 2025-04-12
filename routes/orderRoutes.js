import express from 'express'

const router = express.Router()
import { isAdmin, isAuth } from '../middleware/authMiddelware.js'
import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrderController, singleOrderDetailsController } from '../controller/orderController.js';


router.post('/create', isAuth, createOrderController)
router.get('/my-order', isAuth, getMyOrderController)
router.get('/my-order/:id', isAuth, singleOrderDetailsController)

router.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController)
router.put('/admin/order/:id', isAuth, isAdmin, changeOrderStatusController)


export default router;