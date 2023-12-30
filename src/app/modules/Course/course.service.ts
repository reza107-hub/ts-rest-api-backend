import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { Review } from '../Review/review.model';
import {
  allowedSortFields,
  dateFilter,
  filterByLanguage,
  filterByLevel,
  filterByProvider,
  priceFilter,
  sortOptions,
  tagFilter,
} from './course.constant';
import { SortOrder, TCourse } from './course.interface';
import { Course } from './course.model';
import { JwtPayload } from 'jsonwebtoken';

const createCourseIntoDB = async (createdBy:JwtPayload,payload: TCourse) => {
  const {userId} = createdBy
  const result = await Course.create({...payload,createdBy:userId});
  return result;
};

const getPaginatedAndFilterCoursesFromDB = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>,
) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    tags,
    endDate,
    startDate,
    language,
    provider,
    level,
  } = query;

  if (sortBy && !allowedSortFields.includes(sortBy as string)) {
    throw new Error(
      `Invalid sortBy field. Allowed fields are: ${allowedSortFields.join(
        ', ',
      )}`,
    );
  }

  if (sortBy) {
    sortOptions.push([sortBy as string, sortOrder as SortOrder]);
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    priceFilter.price = {
      $gte: parseFloat(minPrice as string),
      $lte: parseFloat(maxPrice as string),
    };
  }

  if (tags) {
    tagFilter['tags.name'] = tags;
  }

  if (startDate !== undefined && endDate !== undefined) {
    dateFilter.startDate = { $gte: startDate };
    dateFilter.endDate = { $lte: endDate };
  }

  if (language !== undefined) {
    filterByLanguage.language = language;
  }

  if (provider !== undefined) {
    filterByProvider.provider = provider;
  }

  if (level !== undefined) {
    filterByLevel['details.level'] = level;
  }
  const skip = (page - 1) * limit;
  const result = await Course.find({
    ...priceFilter,
    ...tagFilter,
    ...dateFilter,
    ...filterByLanguage,
    ...filterByProvider,
    ...filterByLevel,
  })
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit as string))
    .populate({
      path:'createdBy',
      select:"-password -createdAt -updatedAt -__v"
    });

  const totalCourse = await Course.find();
  return { result, limit, page, total: totalCourse.length };
};

const getCourseWithReviewFromDB = async (id: string) => {
  const result = await Course.findById({ _id: new Object(id) }).populate({
    path:'createdBy',
    select:"-password -createdAt -updatedAt -__v"
  });
  const reviews = await Review.find({ courseId: id });
  return { result, reviews };
};

const getTheBestCourseWithHighestRatingFromDB = async () => {
  const courses = await Course.find().populate({
    path:'createdBy',
    select:"-password -createdAt -updatedAt -__v"
  });;
  let bestCourse = null;
  let highestAverageRating = 0;
  let reviewCount = 0;

  for (const course of courses) {
    const reviews = await Review.find({ courseId: course._id });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    if (averageRating > highestAverageRating) {
      bestCourse = course;
      highestAverageRating = averageRating;
      reviewCount = reviews.length;
    }
  }

  return { bestCourse, highestAverageRating, reviewCount };
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { tags, details, ...courseRemainingData } = payload;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateObject: any = {};

  if (details?.level || details?.description) {
    updateObject['details.level'] = details?.level;
    updateObject['details.description'] = details?.description;
  }

  if (tags && Array.isArray(tags) && tags.length > 0) {
    const updatedTags = tags.filter((tag) => !tag.isDeleted);

    if (updatedTags.length > 0) {
      updateObject['tags'] = updatedTags;
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    { ...courseRemainingData, ...updateObject },
    { new: true, runValidators: true },
  ).populate({
    path:'createdBy',
    select:"-password -createdAt -updatedAt -__v"
  });

  if (!updatedCourse) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }

  return updatedCourse;
};

export const courseService = {
  createCourseIntoDB,
  getPaginatedAndFilterCoursesFromDB,
  getCourseWithReviewFromDB,
  getTheBestCourseWithHighestRatingFromDB,
  updateCourseIntoDB,
};
