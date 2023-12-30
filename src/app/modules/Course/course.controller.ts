import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const payload = req.body;
  const createdBy = req.user
  const result = await courseService.createCourseIntoDB(createdBy,payload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Course created successfully',
    data: result,
  });
});
const getAllCourses = catchAsync(async (req, res) => {
  // console.log(req.query)
  const { result, limit, page, total } =
    await courseService.getPaginatedAndFilterCoursesFromDB(req.query);

  // console.log(result)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses retrieved successfully',
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
    },
    data:{
      courses: result
      
    },
  });
});

const getCourseWithReview = catchAsync(async (req, res) => {
  const id: string = req.params.courseId;
  const { result, reviews } = await courseService.getCourseWithReviewFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course and Reviews retrieved successfully',
    data: {
      course: {
        ...result?.toObject(),
      },
      reviews: reviews.map((review) => review.toObject()),
    },
  });
});
const getBestCourseWithHighestRating = catchAsync(async (req, res) => {
  const { bestCourse, highestAverageRating, reviewCount } =
    await courseService.getTheBestCourseWithHighestRatingFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Best course retrieved successfully',
    data: {
      course: bestCourse,
      averageRating: highestAverageRating.toFixed(1),
      reviewCount: reviewCount,
    },
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const payload = req.body;
  const id = req.params.courseId;
  const result = await courseService.updateCourseIntoDB(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course updated successfully',
    data: result,
  });
});
export const courseControllers = {
  createCourse,
  getAllCourses,
  getCourseWithReview,
  getBestCourseWithHighestRating,
  updateCourse,
};
