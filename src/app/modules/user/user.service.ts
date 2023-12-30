import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { TLoginUser, TUser } from './user.interface'
import User from './user.model'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import { PasswordModel } from '../password/password.model'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import PasswordError from '../../error/passwordError'
const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = result.toObject()
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  )
  await PasswordModel.create({
    email: payload.email,
    passwordArray: [hashedPassword],
  })
  return userWithoutPassword
}

const loginUserService = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByUserName(payload.username)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _id, email, role } = user as any

  const matchPassword = await User.isPasswordMatched(
    payload.password,
    user?.password,
  )
  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not matched!')
  }
  const jwtPayload = {
    userId: _id,
    email: email,
    role: role,
  }
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in as string,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userWithoutPassword = (user as any).toJSON()
  delete userWithoutPassword.password
  delete userWithoutPassword.createdAt
  delete userWithoutPassword.updatedAt
  delete userWithoutPassword.__v
  return {
    user: userWithoutPassword,
    accessToken,
  }
}

const changePasswordService = async (
  req: Request,
  res: Response,
  userData: JwtPayload,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userData.userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'this user is not found')
  }

  const matchPassword = await User.isPasswordMatched(
    currentPassword,
    user.password,
  )
  if (!matchPassword) {
    const lastUsedTimestamp = user?.passwordChangedAt?.toLocaleString()
    const errorMessage = `New password must be unique and different from the last 2 passwords and cannot be the current password (last used on ${lastUsedTimestamp}).`
    throw new PasswordError(httpStatus.BAD_REQUEST, errorMessage)
  }

  const isPasswordSame = await User.isPasswordMatched(
    newPassword,
    user.password,
  )
  if (isPasswordSame) {
    const lastUsedTimestamp = user?.passwordChangedAt?.toLocaleString()
    const errorMessage = `New password must be unique and different from the last 2 passwords and cannot be the current password (last used on ${lastUsedTimestamp}).`
    throw new PasswordError(httpStatus.BAD_REQUEST, errorMessage)
  }

  const passwordHistory = await PasswordModel.findOne({ email: user.email })

  if (passwordHistory) {
    const lastTwoPasswords = passwordHistory.passwordArray.slice(-2)
    for (const password of lastTwoPasswords) {
      if (bcrypt.compareSync(newPassword, password)) {
        const lastUsedTimestamp = user?.passwordChangedAt?.toLocaleString()
        const errorMessage = `New password must be unique and different from the last 2 passwords and cannot be the current password (last used on ${lastUsedTimestamp}).`

        throw new PasswordError(httpStatus.BAD_REQUEST, errorMessage)
      }
    }
  }
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  await PasswordModel.findOneAndUpdate(
    { email: user.email },
    { $push: { passwordArray: newHashedPassword } },
    { upsert: true },
  )
  const result = await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  )
  if (!result) {
    // Handle the case where result is null or undefined
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error updating user password',
    )
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = result.toObject()
  return userWithoutPassword
}
export const userServices = {
  registerUserIntoDB,
  loginUserService,
  changePasswordService,
}
