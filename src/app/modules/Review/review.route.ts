import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { reviewValidation } from './review.validation'
import { reviewController } from './review.controller'

const router = express.Router()

router.post(
  '/',
  validateRequest(reviewValidation.reviewValidationSchema),
  reviewController.createReview,
)

export const reviewRoute = router
