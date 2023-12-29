import { Model } from "mongoose"

export type TUser = {
  username: string
  email: string
  password: string
  role?: 'user' | 'admin'
}


export type TLoginUser = {
  username: string
  password: string
}

export interface UserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistsByUserName(username: string): Promise<TUser>
  isPasswordMatched(
    // eslint-disable-next-line no-unused-vars
    plaintextPassword: string,
    // eslint-disable-next-line no-unused-vars
    hashedPassword: string,
  ): Promise<boolean>
}