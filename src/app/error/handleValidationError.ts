import mongoose from 'mongoose'
import { TGenericErrorResponse } from '../interface/error'

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return `${val?.path} is ${val?.message}`
    },
  )
  const messageErr = errorSources.join(', ')
  const statusCode = 400

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: messageErr,
  }
}

export default handleValidationError
