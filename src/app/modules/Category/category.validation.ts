import { z } from 'zod'

const categoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
  }),
})

export const categoryValidation = {
  categoryValidationSchema,
}
