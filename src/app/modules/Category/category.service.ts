import { JwtPayload } from 'jsonwebtoken'
import { TCategory } from './category.interface'
import { Category } from './category.model'

const createCategoryIntoDB = async (
  createdBy: JwtPayload,
  payload: TCategory,
) => {
  const { userId } = createdBy

  const result = await Category.create({
    ...payload,
    createdBy: userId,
  })

  return result
}
const getAllCategoryFromDB = async () => {
  const result = await Category.find()
  return result
}
export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
}
