/**
 * @description Handles all response messages
 * @returns {Response} Returns http response with error, status code and message and data
 */

 const responseHandler = (req, res, statusCode, data, message) => {
    let error
    let errMessage

    switch (statusCode) {
      // Success
      case 200:
        error = false
        errMessage = data.message || 'Success. '
        break

      // Resource created
      case 201:
        error = false
        errMessage = data.message || 'Created Successfully. '
        break
      
      // No Content
      case 204:
        error = true
        errMessage = message || 'Resource not found. '
        break
  
      //Bad Request
      case 400:
        error = true
        errMessage = message || 'Invalid Request '
        break
  
      // Unauthorized
      case 401:
        error = true
        errMessage = message || 'Unauthorized Request '
        break
  
      // Forbidden
      case 403:
        error = true
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
        errMessage = message || 'Invalid Request '
        break
  
      // Internal Server Error
      case 500:
        error = true
        errMessage = message || 'Internal server error'
        break
  
      default:
        error = true
        errMessage = message || 'Internal server error'
        break
    }

    const response = data || {}

    response.error = error
    response.message = errMessage
    
    return res.status(statusCode).json(response)
  }
  
  export { responseHandler }