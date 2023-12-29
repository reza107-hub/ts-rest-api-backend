import { Schema, model } from 'mongoose'
import { TReview } from './review.interface'
const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      username: {
        type: String,
      },
      email: {
        type: String,
      },
      role: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
)

export const Review = model<TReview>('Review', reviewSchema)
