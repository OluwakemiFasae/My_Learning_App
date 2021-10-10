import jwt from 'jsonwebtoken';

require('dotenv').config();

const Company = require('../../models').Company;

import { responseHandler } from '../../helpers/responseHandler';


 const verify= async (request, response) => {
    
    const { token } = request.params

    // Check we have an id
    if (!token) {
        return responseHandler(request, response, 422, null, 'Missing Token.')
    }

    //Verify the token from the URL
    let payload = null
    try {
        payload = jwt.verify(
            token,
            process.env.VERIFICATION_TOKEN
        );
    } catch (err) {
        return responseHandler(request, response, 500, null, err)
    }

    try {
        // Find user with matching ID
        const user = await Company.findOne({
            where: {
                email: payload.email,
            }
        })

        if (!user) {
            return responseHandler(
                request,
                response,
                404,
                null,
                'User does not exist.'
              )
        }

        // Update user verification status to true
        user.verified = true;

        const verified = await user.update({
            verified: true
        })

        return responseHandler(
            request, 
            response, 
            200, 
            {
                message: `${verified.email} is verified.`,
                data: verified,
            }
        )

    } catch (err) {
        return responseHandler(request, response, 500, null, err)
    }
}

export default verify