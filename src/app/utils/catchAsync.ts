import { NextFunction, Request, RequestHandler, Response } from 'express'
import AppError from '../error/AppError'

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err instanceof AppError && err.isUnauthorized) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message,
          errorMessage: err.errorMessage,
          errorDetails: null,
          stack: null,
        })
      } else {
        next(err)
      }
    })
  }
}

export default catchAsync