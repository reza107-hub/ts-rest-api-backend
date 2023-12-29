import express from 'express'
import { userController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { userValidation } from './user.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'

const router = express.Router()

router.post(
  '/register',
  validateRequest(userValidation.userValidationSchema),
  userController.registerUser,
)
router.post(
  '/login',
  validateRequest(userValidation.loginValidationSchema),
  userController.logInUser,
)
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(userValidation.changePasswordValidationSchema),
  userController.changePassword,
)

export const userRouter = router
