import { Router } from 'express'
import { CategoryRoutes } from '../modules/Category/category.route'
import { reviewRoute } from '../modules/Review/review.route'
import { userRouter } from '../modules/user/user.route'
import { CourseRoute } from '../modules/Course/course.route'
import { CoursesRoute } from '../modules/Course/courses.route'
const router = Router()

const moduleRoutes = [
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/course',
    route: CourseRoute,
  },
  {
    path: '/courses',
    route: CoursesRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/auth',
    route: userRouter,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
