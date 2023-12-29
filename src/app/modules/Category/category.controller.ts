import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CategoryService } from './category.service'

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategoryFromDB()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  })
})

const createCategory = catchAsync(async (req, res) => {
  const payload = req.body
  const result = await CategoryService.createCategoryIntoDB(payload)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  })
})

export const CategoryControllers = {
  createCategory,
  getAllCategory,
}
