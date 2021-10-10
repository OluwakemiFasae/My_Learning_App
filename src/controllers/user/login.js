import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'

import { loginRules }  from '../../helpers/validatorRules'

import { responseHandler } from '../../helpers/responseHandler'

const bcrypt = require('bcrypt')


const Company = require('../../models').Company
const Employee = require('../../models').Employee



const login = async (request, response) => {

    const validate = new Validator(request.body, loginRules)

    if (validate.passes()) {

        const { email } = request.body

        let user = await Company
            .findOne({
                where: {
                    email
                }
            }).catch(error => { 
                return error 
            })

        if (user) {
            user.dataValues.admin = 'true'
        } else {
            user = await Employee.findOne({
                where: {
                    email
                }
            }).catch(error => { 
                return error 
            })

            if (user) {
                user.dataValues.admin = 'false'
            }
            else {
                return responseHandler(
                    request, 
                    response, 
                    404, 
                    null, 
                    'User not found')
            }
        }

        if (!user.verified) {
            return responseHandler(
                request,
                response,
                403,
                null,
                'Please verify your Account.'
              )
        }
        bcrypt.compare(
            request.body.password,
            user.dataValues.password,
            (err, resp) => {
                if (resp === false) {
                    return responseHandler(
                        request,
                        response,
                        401,
                        null,
                        'Invalid Credentials'
                      )
                }
                const token = jwt.sign(
                    { id: user.dataValues.id, email: user.dataValues.email },
                    process.env.JWT_SECRET, { expiresIn: "3d" });
                delete user.dataValues.password;
                return responseHandler(
                    request, 
                    response, 
                    200, 
                    {
                        message: 'Login Successful.',
                        data: user,
                        token,
                    }
                )
            })
    }
    else {
        return responseHandler(
            request,
            response,
            400,
            null,
            validate.errors.all()
          )
    }
}

export default login