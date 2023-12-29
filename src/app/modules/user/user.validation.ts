import { z } from 'zod'
const userValidationSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Username is required',
      })
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email()
      .trim(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .refine(
        (value) => {
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          return regex.test(value)
        },
        {
          message:
            'Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character',
        },
      ),
    role: z.string().default('user').optional(),
  }),
})
const loginValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
})

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z
      .string({
        required_error: 'New Password is required',
      })
      .refine(
        (value) => {
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          return regex.test(value)
        },
        {
          message:
            'New password must contain at least one number, one uppercase letter, one lowercase letter, and one special character',
        },
      ),
  }),
})
export const userValidation = {
  userValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
}
