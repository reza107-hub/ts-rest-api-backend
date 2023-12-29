/* eslint-disable no-unused-vars */
import { NextFunction, Request, RequestHandler, Response } from 'express'
import CustomError from '../error/CustomError'
import PasswordError from '../error/passwordError'
import { TokenExpiredError } from 'jsonwebtoken'
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const handleTokenExpiredError = (err: TokenExpiredError): any => {
  return {
    success: false,
    message: 'Unauthorized Access',
    errorMessage:
      'You do not have the necessary permissions to access this resource.an',
    errorDetails: null,
    stack: null,
  }
}
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err instanceof CustomError && err.isUnauthorized) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message,
          errorMessage: err.errorMessage,
          errorDetails: null,
          stack: null,
        })
      } else if (err instanceof TokenExpiredError) {
        const customResponse = handleTokenExpiredError(err)
        res.status(401).json(customResponse)
      } else if (err instanceof PasswordError) {
        res.status(err.statusCode).json({
          success: false,
          statusCode: err.statusCode,
          message: err.message,
          data: null,
        })
      } else {
        next(err)
      }
    })
  }
}
export default catchAsync
