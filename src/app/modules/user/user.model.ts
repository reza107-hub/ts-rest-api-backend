import mongoose, { Schema } from 'mongoose'
import config from '../../config'
import bcrypt from 'bcrypt'
import { TUser, UserModel } from './user.interface'
const userSchema = new Schema<TUser, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
)
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    )
  }
  next()
})
userSchema.statics.isUserExistsByUserName = async function (username: string) {
  return await User.findOne({ username })
}
userSchema.statics.isPasswordMatched = async function (
  plaintextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plaintextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000
  return passwordChangedTime > jwtIssuedTimestamp
}

const User = mongoose.model<TUser, UserModel>('User', userSchema)

export default User
