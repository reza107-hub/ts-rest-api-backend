import { NextFunction, Request, RequestHandler, Response } from 'express'
import CustomError from '../error/CustomError'
import PasswordError from '../error/passwordError'

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
