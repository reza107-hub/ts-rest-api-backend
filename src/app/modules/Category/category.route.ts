import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { categoryValidation } from './category.validation'
import { CategoryControllers } from './category.controller'
const router = express.Router()

router.post(
  '/',
  validateRequest(categoryValidation.categoryValidationSchema),
  CategoryControllers.createCategory,
)

router.get('/', CategoryControllers.getAllCategory)

export const CategoryRoutes = router
