import { z } from 'zod'

const reviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string(),
    rating: z.number().refine((value) => value >= 1 && value <= 5, {
      message: 'Rating must be between 1 and 5 inclusive',
    }),
    review: z.string(),
  }),
})

export const reviewValidation = {
  reviewValidationSchema,
}
