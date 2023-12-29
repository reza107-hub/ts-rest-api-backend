import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { categoryValidation } from './category.validation'
import { CategoryControllers } from './category.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(categoryValidation.categoryValidationSchema),
  CategoryControllers.createCategory,
)
router.get('/', CategoryControllers.getAllCategory)
export const CategoryRoutes = router
