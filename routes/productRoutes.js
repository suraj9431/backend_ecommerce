import express from 'express'
import { createProductController, deleteProductController, deleteProductImageController, getAllProductController, getSingleProductController, getTopProductController, productReviewController, updateProductController, updateProductImageController } from '../controller/productController.js'
const router = express.Router()
import { isAdmin, isAuth } from '../middleware/authMiddelware.js'
import { singleUpload } from '../middleware/multer.js'

router.get('/all', getAllProductController)
router.get('/top', getTopProductController)
router.get('/:id', getSingleProductController)
//create products
router.post('/create', isAuth, isAdmin, singleUpload, createProductController)
router.put('/:id', isAuth, isAdmin, updateProductController)
router.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageController)
router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController)
router.delete('/delete/:id', isAuth, isAdmin, deleteProductController)
router.put('/review/:id', isAuth, productReviewController)

export default router;