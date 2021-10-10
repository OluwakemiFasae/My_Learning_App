import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'
import Mailer from '../../services/Mailer'

import { resetRules } from '../../helpers/validatorRules'

const Company = require('../../models').Company
const Employee = require('../../models').Employee

import { responseHandler } from '../../helpers/responseHandler'

const resetPwdTemplate = require('../../services/Templates/resetPwdTemplate').default
 
 const resetEmail = async(request, response) => {
    const { email } = request.body

    const validate = new Validator(request.body, resetRules);
    
    let user;

    if (validate.passes()) {

        user = await Company
            .findOne({
                where: {
                    email
                }
            }).catch(error => { 
                return error 
            })

        if (!user) {
            
            user = await Employee.findOne({
                where: {
                    email
                }
            }).catch(error => { 
                return error
            })

            if (!user) {
                return responseHandler(
                    request, 
                    response, 
                    404, 
                    null, 
                    'User not found')
            }
        }


        const pwToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.VERIFICATION_TOKEN,
            { expiresIn: "7d" }
        );

        const content = `api/v1/company/resetpwd/${pwToken}`

        const recipients = user.email

        //send email here
        const newMail = {
            subject: 'Reset your Password',
            recipients: recipients.split(',')
            .map(email => ({ 
                email: email.trim() 
            })),
            body: content
        }

        const mailer = new Mailer(newMail, resetPwdTemplate(newMail));

        try {
            await mailer.send();
        } catch (err) {
            return responseHandler(
                request, 
                response, 
                422, 
                null, 
                err)
        }

        return responseHandler(
            request, 
            response, 
            200, 
            {
                message: `A reset password link has been sent to your email - ${user.email}`,
                data: user,
                pwToken,
          }
        )
    }
    else {
        return responseHandler(
            request,
            response,
            404,
            null,
            validate.errors.all()
          )
    }
}

export default resetEmail