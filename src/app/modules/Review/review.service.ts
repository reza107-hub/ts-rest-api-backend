import { JwtPayload } from 'jsonwebtoken'
import { TReview } from './review.interface'
import { Review } from './review.model'
import User from '../user/user.model'

const createReviewIntoDB = async (createdBy: JwtPayload, payload: TReview) => {
  const { userId } = createdBy

  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }
  const result = await Review.create({
    ...payload,
    createdBy: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  })
  return result
}

export const reviewServices = {
  createReviewIntoDB,
}
