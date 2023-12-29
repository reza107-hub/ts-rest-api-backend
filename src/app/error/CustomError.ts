class CustomError extends Error {
  public statusCode: number
  public isUnauthorized: boolean
  public errorMessage?: string | null

  constructor(
    statusCode: number,
    message: string,
    isUnauthorized = false,
    errorMessage: string | null = null,
    stack = '',
  ) {
    super(message)
    this.statusCode = statusCode
    this.isUnauthorized = isUnauthorized
    this.errorMessage = errorMessage

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default CustomError
