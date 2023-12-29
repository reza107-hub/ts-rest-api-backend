import express from 'express'
import { courseControllers } from './course.controller'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidations } from './course.validation'

const router = express.Router()

router.get('/', courseControllers.getAllCourses)
router.get('/:courseId/reviews', courseControllers.getCourseWithReview)
router.put(
  '/:courseId',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
)

export const CoursesRoute = router
