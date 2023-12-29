import { Types } from 'mongoose'

export type TReview = {
  courseId: Types.ObjectId
  rating: number
  review: string
  createdBy?: {
    _id: Types.ObjectId
    username: string
    email: string
    role: 'user'
  }
}
