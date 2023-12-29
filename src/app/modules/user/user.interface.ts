/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  username: string
  email: string
  password: string
  passwordChangedAt?: Date
  role?: 'user' | 'admin'
}

export type TLoginUser = {
  username: string
  password: string
}
export type TUserRole = keyof typeof USER_ROLE
export interface UserModel extends Model<TUser> {
  isUserExistsByUserName(username: string): Promise<TUser>
  isPasswordMatched(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}
