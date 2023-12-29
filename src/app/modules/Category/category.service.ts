import { TCategory } from './category.interface'
import { Category } from './category.model'

const getAllCategoryFromDB = async () => {
  const result = await Category.find()
  return result
}

const createCategoryIntoDB = async (payload: TCategory) => {
  const result = await Category.create(payload)
  return result
}

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
}
