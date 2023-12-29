import { ZodError, ZodIssue } from 'zod'
import { TGenericErrorResponse } from '../interface/error'

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const messageError = err.issues.map((issue: ZodIssue) => {
    return `${issue?.path[issue.path.length - 1]} is ${issue.message}`
  })
  const statusCode = 400
  const messageErr = messageError.join(', ')
  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: messageErr,
  }
}

export default handleZodError
