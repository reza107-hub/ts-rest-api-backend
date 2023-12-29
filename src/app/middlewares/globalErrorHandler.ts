/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from '../config'

import { TErrorSources } from '../interface/error'
import handleZodError from '../error/handleZodError'
import handleValidationError from '../error/handleValidationError'
import handleCastError from '../error/handleCastError'
import handleDuplicateError from '../error/handleDuplicateError'
import AppError from '../error/AppError'

const globalErrorHandler: ErrorRequestHandler = (
  errorDetails,
  req,
  res,
  next,
) => {
  //setting default values
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorMessage: string = ''

  if (errorDetails instanceof ZodError) {
    const simplifiedError = handleZodError(errorDetails)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessage = simplifiedError?.errorMessage
  } else if (errorDetails?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(errorDetails)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessage = simplifiedError?.errorMessage
  } else if (errorDetails?.name === 'CastError') {
    const simplifiedError = handleCastError(errorDetails)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessage = simplifiedError?.errorMessage
  } else if (errorDetails?.code === 11000) {
    const simplifiedError = handleDuplicateError(errorDetails)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessage = simplifiedError?.errorMessage
  } else if (errorDetails instanceof AppError) {
    statusCode = errorDetails?.statusCode
    message = errorDetails.message
  } else if (errorDetails instanceof Error) {
    message = errorDetails.message
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack: config.NODE_ENV === 'development' ? errorDetails?.stack : null,
  })
}

export default globalErrorHandler
