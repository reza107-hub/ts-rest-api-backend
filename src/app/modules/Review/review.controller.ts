import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { reviewServices } from './review.service'

const createReview = catchAsync(async (req, res) => {
  const payload = req.body
  const result = await reviewServices.createReviewIntoDB(payload)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Review created successfully',
    data: result,
  })
})

export const reviewController = {
  createReview,
}
