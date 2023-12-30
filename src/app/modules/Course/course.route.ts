import express from 'express';
import { courseControllers } from './course.controller';


const router = express.Router();


router.get('/best', courseControllers.getBestCourseWithHighestRating);

export const CourseRoute = router;
