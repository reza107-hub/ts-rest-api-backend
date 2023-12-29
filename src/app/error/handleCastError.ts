import mongoose from 'mongoose'
import { TGenericErrorResponse } from '../interface/error'

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const messageError = `${err.value._id} is not valid id`
  const statusCode = 400

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessage: messageError,
  }
}

export default handleCastError
