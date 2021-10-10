import jwt from 'jsonwebtoken'

import { responseHandler } from '../helpers/responseHandler'

const authorize = (request, response, next) => {
    if (request.user){
        next()
    }else {
        if (!request.headers.authorization) {
            responseHandler(
              request,
              response,
              401,
              null,
              "Please log in"
            )
            return false;
          }
          
          const bearerHeader = request.headers.authorization;
          const parts = bearerHeader.split(' ');
          if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
              const token = credentials;
              request.token = token;
      
              // verify token
              jwt.verify(request.token, process.env.JWT_SECRET, (error, decoded) => {
                if (error) {
                  return responseHandler(
                    request,
                    response,
                    401,
                    null,
                    "Token has expired"
                  )
                }
                request.user = decoded;
                next();
              });
            }
          }
    }
    
  }

export default authorize;