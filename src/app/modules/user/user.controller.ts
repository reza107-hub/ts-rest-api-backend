import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { userServices } from './user.service'
const registerUser = catchAsync(async (req, res) => {
  const result = await userServices.registerUserIntoDB(req.body)
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  })
})
const logInUser = catchAsync(async (req, res) => {
  const { user, accessToken } = await userServices.loginUserService(req.body)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User login successful',
    data: {
      user: user,
      token: accessToken,
    },
  })
})
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const result = await userServices.changePasswordService(
    req,
    res,
    req.user,
    currentPassword,
    newPassword,
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'password change successful',
    data: result,
  })
})
export const userController = {
  registerUser,
  logInUser,
  changePassword,
}
