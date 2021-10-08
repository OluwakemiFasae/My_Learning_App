import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'
import Mailer from '../services/Mailer'

import { responseHandler } from '../helpers/responseHandler'

const bcrypt = require('bcrypt')

const Company = require('../models').Company
const Employee = require('../models').Employee

const resetPwdTemplate =
  require('../services/Templates/resetPwdTemplate').default

const saltRounds = 10

const loginRules = {
  email: 'required|email',
  password: 'required',
}

const resetRules = {
  email: 'required|email',
}

export default class UserController {
  async login(request, response) {
    const validate = new Validator(request.body, loginRules)

    if (validate.passes()) {
      let user = await Company.findOne({
        where: {
          email: request.body.email,
        },
      }).catch(error => {
        return error
      })

      if (user) {
        user.dataValues.admin = 'true'
      } else {
        user = await Employee.findOne({
          where: {
            email: request.body.email,
          },
        }).catch(error => {
          return error
        })

        if (user) {
          user.dataValues.admin = 'false'
        } else {
          return responseHandler(request, response, 404, null, 'User not found')
          /* 	response.status(404).json({
						status: 'Unsuccessful',
						message: 'User not found',
					}); */
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
        /*  response.status(403).send({
          message: 'Please verify your Account.',
        }) */
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
            /*   response.status(401).send({
					message: 'Wrong Password',
				  }) */
          }
          const token = jwt.sign(
            { id: user.dataValues.id, email: user.dataValues.email },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
          )
          delete user.dataValues.password
          return responseHandler(request, response, 200, {
            message: 'Login Successful.',
            data: user,
            token,
          })
          /* response.status(200).send({
			  message: 'login successful',
			  user,
			  token,
			})
		   */
        }
      )
    } else {
      return responseHandler(
        request,
        response,
        400,
        null,
        validate.errors.all()
      )
      /* response.status(400).json({
        status: 'Unsuccessful',
        message: 'Invalid data input',
        errors: validate.errors.all(),
      }) */
    }
  }

  getCurrentUser(request, response) {
    return response.send(request.user)
  }

  async resetEmail(request, response) {
    const { email } = request.body

    const validate = new Validator(request.body, resetRules)
    let user

    if (validate.passes()) {
      user = await Company.findOne({
        where: {
          email,
        },
      }).catch(error => {
        return error
      })

      if (!user) {
        console.log('I should not get here o')
        user = await Employee.findOne({
          where: {
            email,
          },
        }).catch(error => {
          return error
        })

        if (!user) {
          return responseHandler(request, response, 404, null, 'User not found')
          /* 	response.status(404).json({
            status: 'Unsuccessful',
            message: 'User not found',
          }) */
        }
      }

      const pwToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.VERIFICATION_TOKEN,
        { expiresIn: '7d' }
      )

      const content = `api/v1/company/resetpwd/${pwToken}`

      const recipients = user.email

      //send email here
      const newMail = {
        subject: 'Reset your Password',
        recipients: recipients
          .split(',')
          .map(email => ({ email: email.trim() })),
        body: content,
      }

      const mailer = new Mailer(newMail, resetPwdTemplate(newMail))

      try {
        await mailer.send()
      } catch (err) {
        return responseHandler(request, response, 422, null, err)
        /*    response.status(422).send({
          message: err,
        }) */
      }

      return responseHandler(request, response, 200, {
        message: `A reset password link has been sent to your email - ${user.email}`,
        data: user,
        pwToken,
      })
      /* 	response.status(201).send({
        message: `A reset password link has been sent to your email - ${user.email}`,
        data: user,
        pwToken,
        error: false,
      }) */
    } else {
      return responseHandler(
        request,
        response,
        404,
        null,
        validate.errors.all()
      )
      /* return response.status(404).send({
        status: 'Invalid email',
        error: true,
        errors: validate.errors.all(),
      }) */
    }
  }

  async resetPassword(request, response) {
    //
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
      /*   return response.status(422).send({
        message: 'Please enter a password',
      }) */
    }

    // Check we have an id
    if (!token) {
      return responseHandler(request, response, 422, null, 'Missing Token.')
      /* 	response.status(422).send({
        message: 'Missing Token',
      }) */
    }

    //Verify the token from the URL
    let payload = null
    try {
      payload = jwt.verify(token, process.env.VERIFICATION_TOKEN)
    } catch (err) {
      return responseHandler(request, response, 422, null, err)
      //   response.status(500).send(err)
    }

    let user
    try {
      // Find user with matching ID
      user = await Company.findOne({
        where: {
          email: payload.email,
        },
      })

      if (!user) {
        user = await Employee.findOne({
          where: {
            email: payload.email,
          },
        })

        if (!user) {
          return responseHandler(
            request,
            response,
            404,
            null,
            'User does not  exists'
          )
          /* response.status(404).send({
            message: 'User does not  exists',
          }) */
        }
      }

      bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
        const newUpdate = await user.update({
          password: hash,
        })

        return responseHandler(request, response, 200, {
          message: `Successful!! Your password has been changed`,
          data: newUpdate.dataValues.password,
        })
        /*  response.status(200).send({
          message: `Successful!! Your password has been changed`,
          data: newUpdate.dataValues.password,
          error: false,
        }) */
      })
    } catch (err) {
      console.log(err)
      return responseHandler(request, response, 500, null, err)
      // response.status(500).send(err)
    }
  }

  async changePassword(request, response) {
    //
    const { oldPassword, newPassword } = request.body

    const id = parseInt(request.user.id)
    let user

    try {
      // Find user with matching ID

      user = await Company.findByPk(id, {
        where: {
          id,
        },
      })

      if (!user) {
        user = await Employee.findByPk(id, {
          where: {
            id,
          },
        })

        if (!user) {
          return responseHandler(
            request,
            response,
            404,
            null,
            'User does not  exists'
          )
          /*   response.status(404).send({
            message: 'User does not  exists',
          })
        */
        }
      }

      bcrypt.compare(oldPassword, user.dataValues.password, (err, resp) => {
        if (resp === false) {
          return responseHandler(
            request,
            response,
            403,
            null,
            'Invalid credentials'
          )
          /* response.status(401).send({
            message: 'Wrong Password',
          }) */
        }
        bcrypthash(newPassword, saltRounds, async (err, hash) => {
          const newUpdate = await user.update({
            password: hash,
          })

          return responseHandler(request, response, 200, {
            message: `Successful!! Your password has been changed`,
          })
          /*   response.status(200).send({
            message: `Successful!! Your password has been changed`,
            error: false,
          }) */
        })
      })
    } catch (err) {
      console.log(err)
      return responseHandler(request, response, 500, null, err)
      //   return response.status(500).send(err)
    }
  }
}
