import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../error/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import User from '../modules/user/user.model'
import { TUserRole } from '../modules/user/user.interface'
import CustomError from '../error/CustomError'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
      throw new CustomError(
        httpStatus.UNAUTHORIZED,
        'Unauthorized Access',
        true,
        'You do not have the necessary permissions to access this resource.',
      )
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { userId, email, role, iat } = decoded
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new CustomError(
        httpStatus.UNAUTHORIZED,
        'Unauthorized Access',
        true,
        'You do not have the necessary permissions to access this resource.',
      )
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new CustomError(
        httpStatus.UNAUTHORIZED,
        'Unauthorized Access',
        true,
        'You do not have the necessary permissions to access this resource.',
      )
    }
    req.user = decoded as JwtPayload & { role: string }
    next()
  })
}
export default auth
