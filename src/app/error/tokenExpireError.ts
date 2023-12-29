export class CustomTokenError extends Error {
  public statusCode: number
  public isUnauthorized: boolean
  public errorMessage?: string | null
  public expiredAt: Date

  constructor(
    statusCode: number,
    message: string,
    expiredAt: Date,
    isUnauthorized = false,
    errorMessage: string | null = null,
    stack = '',
  ) {
    super(message)
    this.statusCode = statusCode
    this.isUnauthorized = isUnauthorized
    this.errorMessage = errorMessage
    this.expiredAt = expiredAt

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default CustomTokenError
