import express from 'express';
import { courseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();


router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.TCourseValidationSchema),
  courseControllers.createCourse,
);
router.get('/', courseControllers.getAllCourses);
router.get('/:courseId/reviews', courseControllers.getCourseWithReview);
router.put(
  '/:courseId',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);

export const CoursesRoute = router;
