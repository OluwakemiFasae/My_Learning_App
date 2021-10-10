import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'
import Mailer from '../../services/Mailer'


require('dotenv').config()
const bcrypt = require('bcrypt')

const verifyTemplate = require('../../services/Templates/verifyTemplate').default

const Company = require('../../models').Company

import { companyRules } from '../../helpers/validatorRules'

import { saltRounds } from '../../helpers/constants'

import { responseHandler } from '../../helpers/responseHandler'



const createAccount = async (request, response) => {

    let validate = new Validator(request.body, companyRules);
    if (validate.passes()) {

        const { companyName, companyEmail, password } = request.body

        const company = await Company.findOne({
            where: {
                email: companyEmail
            },
        }).catch(error => { 
            return error 
        })


        if (!company) {

            try {
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    const newCompany = await Company
                        .create({
                            companyName,
                            email: companyEmail,
                            password: hash
                        }).catch(error => { 
                            return error 
                        })

                    if(newCompany){
                        const vToken = jwt.sign(
                        { 
                            id: newCompany.id, 
                            email: newCompany.email 
                        },
                        process.env.VERIFICATION_TOKEN,
                        { expiresIn: "7d" }
                    );

                    const content = `api/v1/company/verify/${vToken}`
                    
                    const recipients = newCompany.email

                    //send email here
                    const newMail = {
                        subject: 'Verify Account',
                        recipients: recipients.split(',').map(email => ({ email: email.trim() })),
                        body: content
                    }

                    const mailer = new Mailer(newMail, verifyTemplate(newMail));

                    try {
                        await mailer.send();
                    } catch (err) {
                        return responseHandler(request, response, 422, null, err)
                    }

                    return responseHandler(
                        request, 
                        response, 
                        201, 
                        {
                            message: `Account created Successfully!! A verification email has been sent to ${newCompany.email}`,
                            data: newCompany,
                            vToken,
                        }
                    )
                }  else {
                    return responseHandler(
                      request,
                      response,
                      400,
                      null,
                      'Company wasn\'t created successfully'
                    )
                  }

                })
            } catch (error) {
                return (error)
            }
        } else {
            return responseHandler(
              request,
              response,
              400,
              null,
              'Company already exists'
            )
          }
    }
    else {
        return responseHandler(request, response, 422, null, {
            ...validate.errors.all(),
          })
    }
}

export default createAccount