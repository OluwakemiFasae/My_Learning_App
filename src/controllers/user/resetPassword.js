import jwt from 'jsonwebtoken';

import { saltRounds } from '../../helpers/constants';
import { responseHandler } from '../../helpers/responseHandler';

const bcrypt = require('bcrypt');


const Company = require('../../models').Company;
const Employee = require('../../models').Employee;


const resetPassword = async(request, response) => {
    
    const { token } = request.params
    const { newPassword } = request.body

    if (!newPassword) {
        return responseHandler(
            request,
            response,
            422,
            null,
            'Please enter a password'
          )
    }

    // Check we have an id
    if (!token) {
        return responseHandler(
            request, 
            response, 
            422, 
            null, 
            'Missing Token.'
        )
    }


    //Verify the token from the URL
    let payload = null
    try {
        payload = jwt.verify(
            token,
            process.env.VERIFICATION_TOKEN
        );

    } catch (err) {
        return responseHandler(
            request, 
            response, 
            422, 
            null, 
            err
        )
    }

    let user
    try {
        // Find user with matching ID
        user = await Company.findOne({
            where: {
                email: payload.email,
            }
        })

        if (!user) {
            user = await Employee.findOne({
                where: {
                    email: payload.email
                }
            })

            if (!user) {
                return responseHandler(
                    request,
                    response,
                    404,
                    null,
                    'User does not  exists'
                  )
            }
        }

        bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
            const newUpdate = await user.update({
                password: hash
            })

            return responseHandler(
                request, 
                response, 
                200, 
                {
                    message: `Successful!! Your password has been changed`,
                }
            )
        })

    } catch (err) {
        return responseHandler(request, response, 500, null, err)
    }

}

export default resetPassword