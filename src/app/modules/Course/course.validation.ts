import { z } from 'zod';

const TTagValidationSchema = z.object({
  name: z.string().trim(),
  isDeleted: z.boolean(),
});
const updatedTagValidationSchema = z.object({
  name: z.string().trim().optional(),
  isDeleted: z.boolean().optional(),
});
const TCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim(),
    instructor: z.string().trim(),
    categoryId: z.string(),
    price: z.number(),
    tags: z.array(TTagValidationSchema),
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    details: z.object({
      level: z.string().trim(),
      description: z.string().trim(),
    }),
  }),
});
const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().optional(),
    instructor: z.string().trim().optional(),
    categoryId: z.string().optional(),
    price: z.number().optional(),
    tags: z.array(updatedTagValidationSchema).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    language: z.string().optional(),
    provider: z.string().optional(),
    details: z
      .object({
        level: z.string().trim().optional(),
        description: z.string().trim().optional(),
      })
      .optional(),
  }),
});

export const CourseValidations = {
  TTagValidationSchema,
  TCourseValidationSchema,
  updateCourseValidationSchema,
};
