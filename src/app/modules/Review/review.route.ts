import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { reviewValidation } from './review.validation'
import { reviewController } from './review.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(reviewValidation.reviewValidationSchema),
  reviewController.createReview,
)

export const reviewRoute = router
