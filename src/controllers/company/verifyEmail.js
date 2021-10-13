import jwt from 'jsonwebtoken';

require('dotenv').config();

const Company = require('../../models').Company;

import { responseHandler } from '../../helpers/responseHandler';


const verify = async (request, response) => {

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

            },
            attributes: ['id', 'companyName', 'email']
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

        
        const verified = await user.update({
            verified: true
        })

        // Update user admin status to true
        verified.dataValues.admin = true;

        const token = jwt.sign(
            { id: verified.dataValues.id, email: verified.dataValues.email, admin: verified.dataValues.admin },
            process.env.JWT_SECRET, { expiresIn: "3d" });

        return responseHandler(
            request,
            response,
            200,
            {
                message: `${ verified.email } is verified.`,
                data: verified, token
            }
        )

    } catch (err) {
        return responseHandler(request, response, 500, null, err)
    }
}

export default verify