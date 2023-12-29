import { Schema, model } from 'mongoose'
import { TReview } from './review.interface'

const reviewSchema = new Schema<TReview>({
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
})

export const Review = model<TReview>('Review', reviewSchema)
