import { TUser } from './user.interface'
import User from './user.model'

const registerUserIntoDB = async (payload: TUser) => {
  // console.log(payload)
  const result = await User.create(payload)
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = result.toObject()
  return userWithoutPassword
}

export const userServices = {
  registerUserIntoDB,
}
