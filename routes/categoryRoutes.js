import express from 'express'

const router = express.Router()
import { isAdmin, isAuth } from '../middleware/authMiddelware.js'
import { createController, deleteCategoryController, getAllCategoryController, updateCategoryController } from '../controller/categoryController.js';

router.post('/create', isAuth, isAdmin, createController)
router.get('/get-all', getAllCategoryController)
router.delete('/delete/:id', isAuth, isAdmin, deleteCategoryController)
router.put('/update/:id', isAuth, isAdmin, updateCategoryController)


export default router;