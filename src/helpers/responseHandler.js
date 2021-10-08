/**
 * @description Handles all response messages
 * @returns {Response} Returns http response with error, status code and message and data
 */

const responseHandler = (req, res, statusCode, data, message) => {
  let error = false
  let status = 'Success'
  let errMessage = message
  switch (statusCode) {
    // No Content
    case 204:
      errMessage = message || 'Resource not found. '
      break

    //Bad Request
    case 400:
      error = true
      status = 'Unsuccessful'
      errMessage = message || 'Invalid Request '
      break

    // Unauthorized
    case 401:
      error = true
      status = 'Unsuccessful'
      errMessage = message || 'Unauthorized Request '
      break

    // Forbidden
    case 403:
      error = true
      status = 'Unsuccessful'
      errMessage = message || 'Access to this recource is denied!'
      break

    // Not Found
    case 404:
      error = true
      errMessage = message || 'Resource not found!'
      break

    //   Cannot process request
    case 422:
      error = true
      status = 'Unsuccessful'
      errMessage = message || 'Invalid Request '
      break

    // Inernal Server Error
    case 500:
      error = true
      errMessage = message || 'Internal server error'
      break

    default:
      status = 'Unsuccessful'
      errMessage = message || 'Internal server error'
      break
  }
  const response = data || {}
  if (error) {
    response.error = true
    response.status = 'Unsuccessful'
    response.message = errMessage
  }
  return res.status(statusCode).json(response)
}

export { responseHandler }
