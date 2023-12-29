import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidations } from './course.validation'
import { courseControllers } from './course.controller'

const router = express.Router()

router.post(
  '/',
  validateRequest(CourseValidations.TCourseValidationSchema),
  courseControllers.createCourse,
)

router.get('/best', courseControllers.getBestCourseWithHighestRating)

export const CourseRoute = router
