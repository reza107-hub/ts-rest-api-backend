import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { TLoginUser, TUser } from './user.interface'
import User from './user.model'
import jwt from 'jsonwebtoken'
import config from '../../config'
const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = result.toObject()
  return userWithoutPassword
}

const loginUserService = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByUserName(payload.username)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _id, username, email, role } = user as any

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!')
  }

  const matchPassword = await User.isPasswordMatched(
    payload.password,
    user.password,
  )
  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not matched!')
  }

  const jwtPayload = {
    userId: _id,
    username: username,
    email: email,
    role: role,
  }

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in as string,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userWithoutPassword = (user as any).toJSON()
  delete userWithoutPassword.password

  return {
    user: userWithoutPassword,
    accessToken,
  }
}

export const userServices = {
  registerUserIntoDB,
  loginUserService,
}
