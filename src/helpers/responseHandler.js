/**
 * @description Handles all response messages
 * @returns {Response} Returns http response with error, status code and message and data
 */

 const responseHandler = (req, res, statusCode, data, message) => {
    let error
    let msg
    let response = data || {}

    switch (statusCode) {
      // Success
      case 200:
        error = false
        msg = data.message || 'Success. '
        break

      // Resource created
      case 201:
        error = false
        msg = data.message || 'Created Successfully. '
        break
      
      
      //Bad Request
      case 400:
        error = true
        msg = message || 'Invalid Request '
        break
  
      // Unauthorized
      case 401:
        error = true
        msg = data.message || 'Unauthorized Request '
        break
  
      // Forbidden
      case 403:
        error = true
        msg = message || 'Access to this recource is denied!'
        break
  
      // Not Found
      case 404:
        error = true
        msg = message || 'Resource not found!'
        break
  
      //   Cannot process request
      case 422:
        error = true
        msg = message || 'Invalid Request '
        break
  
      // Internal Server Error
      case 500:
        error = true
        msg = message || 'Internal server error'
        break
  
      default:
        error = true
        msg = message || 'Internal server error'
        break
    }

    
    response.error = error
    response.message = msg
    
    
    return res.status(statusCode).json(response)
  }
  
  export { responseHandler }