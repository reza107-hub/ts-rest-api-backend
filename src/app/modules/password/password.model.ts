import { Schema } from 'mongoose'
import { TUserPassword } from './password.interface'
import mongoose from 'mongoose'

const passwordModelSchema = new Schema<TUserPassword>({
  email: {
    type: String,
    ref: 'User',
    required: true,
  },
  passwordArray: {
    type: [String],
    required: true,
  },
})
export const PasswordModel = mongoose.model<TUserPassword>(
  'Password',
  passwordModelSchema,
)
