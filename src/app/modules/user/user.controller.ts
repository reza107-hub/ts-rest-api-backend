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

export const userController = {
  registerUser,
}
