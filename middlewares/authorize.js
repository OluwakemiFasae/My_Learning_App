import jwt from 'jsonwebtoken'


const authorize = (request, response, next) => {
    if (request.user){
        next()
    }else {
        if (!request.headers.authorization) {
            response.status(401).send({
              message: 'Please Log In',
            });
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
                  return response.status(401)
                    .send({
                      status: 'Error',
                      message: 'Invalid Token',
                    });
                }
                request.user = decoded;
                next();
              });
            }
          }
    }
    
  }

export default authorize;