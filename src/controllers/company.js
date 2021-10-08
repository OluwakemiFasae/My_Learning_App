import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'
import Mailer from '../services/Mailer'

import { responseHandler } from '../helpers/responseHandler'

require('dotenv').config()
const bcrypt = require('bcrypt')

const verifyTemplate = require('../services/Templates/verifyTemplate').default

const Company = require('../models').Company
const Department = require('../models').Department

const saltRounds = 10

const companyRules = {
  companyName: 'required|min:3',
  companyEmail: 'required|email',
  password: 'required|min:5',
}

const updateRules = {
  companyName: 'required|min:3',
  logoUrl: 'required|min:3',
  contactNo: 'required|min:8',
  address: 'required|min:5',
  employeeSize: 'required',
  state: 'required',
  country: 'required',
}

export default class CompanyController {
  async createAccount(request, response) {
    let validate = new Validator(request.body, companyRules)
    if (validate.passes()) {
      const { companyName, companyEmail, password } = request.body

      const company = await Company.findOne({
        where: {
          email: companyEmail,
        },
      }).catch(error => {
        return error
      })

      if (!company) {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          const newCompany = await Company.create({
            companyName,
            email: companyEmail,
            password: hash,
          }).catch(error => {
            return error
          })

          const vToken = jwt.sign(
            { id: newCompany.id, email: newCompany.email },
            process.env.VERIFICATION_TOKEN,
            { expiresIn: '7d' }
          )

          const content = `api/v1/company/verify/${vToken}`
          //const content = url
          const recipients = newCompany.email

          //send email here
          const newMail = {
            subject: 'Verify Account',
            recipients: recipients
              .split(',')
              .map(email => ({ email: email.trim() })),
            body: content,
          }

          const mailer = new Mailer(newMail, verifyTemplate(newMail))

          try {
            await mailer.send()
          } catch (err) {
            return responseHandler(request, response, 422, null, err)
          }

          return responseHandler(request, response, 201, {
            message: `Account created Successfully!! A verification email has been sent to ${newCompany.email}`,
            data: newCompany,
            vToken,
          })
        })
      } else {
        return responseHandler(
          request,
          response,
          400,
          null,
          'Company already exists'
        )
      }
    } else {
      return responseHandler(request, response, 422, null, {
        ...validate.errors.all(),
      })
    }
  }

  // Verify Account creation Token
  async verify(request, response, next) {
    const { token } = request.params

    // Check we have an id
    if (!token) {
      return responseHandler(request, response, 422, null, 'Missing Token.')
      /*        return response.status(422).send({ message: 'Missing Token'}) */
    }

    //Verify the token from the URL
    let payload = null
    try {
      payload = jwt.verify(token, process.env.VERIFICATION_TOKEN)
    } catch (err) {
      return response.status(500).send(err)
    }

    try {
      // Find user with matching ID
      const user = await Company.findOne({
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
          'User does not exist.'
        )
        // return response.status(404).send({
        //   message: 'User does not  exists',
        // })
      }

      // Update user verification status to true
      user.verified = true

      const verified = await user.update({
        verified: true,
      })
      return responseHandler(request, response, 200, {
        message: `${verified.email} is verified.`,
        data: verified,
      })
      /*  response.status(200).send({
        message: `${verified.email} is verified`,
        data: verified,
      }) */

      //next()
    } catch (err) {
      return responseHandler(request, response, 500, null, err)
      // return response.status(500).send(err)
    }
  }

  async UpdateAccount(request, response) {
    const companyId = parseInt(request.user.id)
    const company = await Company.findByPk(companyId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    }).catch(error => {
      return error
    })
    if (company) {
      let validate = new Validator(request.body, updateRules)

      if (validate.passes()) {
        const {
          companyName,
          logoUrl,
          contactNo,
          address,
          employeeSize,
          state,
          country,
        } = request.body

        const updatedDetails = await company
          .update({
            companyName: companyName || company.companyName,
            verified: company.verified,
            logoUrl: logoUrl || company.logoUrl,
            contactNo: contactNo || company.contactNo,
            address: address || company.address,
            employeeSize: employeeSize || company.employeeSize,
            state: state || company.state,
            country: country || company.country,
          })
          .catch(error => {
            return error
          })
        return responseHandler(request, response, 200, {
          message: `Successful!! ${company.companyName} has been updated`,
          data: updatedDetails,
        })
        /*    response.status(200).send({
          message: `Successful!! ${company.companyName} has been updated`,
          data: updatedDetails,
          error: false,
        }) */
      } else {
        return responseHandler(
          request,
          response,
          400,
          null,
          validate.errors.all()
        )
        /* return response.status(400).json({
          status: 'Unsuccessful',
          message: 'Invalid data input',
          error: true,
          errors: validate.errors.all(),
        }) */
      }
    } else {
      return responseHandler(
        request,
        response,
        404,
        null,
        "This company isn't registered. Please register"
      )
      /* 
      response.status(404).json({
        status: 'Unsuccessful',
        error: true,
        message: "This company isn't registered. Please register",
      }) */
    }
  }

  async AddDept(request, response) {
    const companyId = parseInt(request.user.id)

    const company = await Company.findByPk(companyId).catch(error => {
      return error
    })

    if (company) {
      if (!request.body.depts) {
        return responseHandler(request, response, 204)
        /*     response.status(404).json({
          message: 'Empty data',
          error: true,
        }) */
      } else {
        const depts = request.body.depts
        let addedDepts = []
        let existing = []

        for (let dept of depts) {
          const dpt = await Department.findOne({
            where: {
              companyId,
              deptName: dept,
            },
          }).catch(error => {
            return error
          })

          if (dpt) {
            existing.push(dpt.dataValues.deptName)
            continue
          } else {
            const addedDept = await Department.create({
              companyId,
              deptName: dept,
            }).catch(error => {
              return error
            })

            addedDepts.push(addedDept.deptName)
          }
        }
        return responseHandler(request, response, 201, {
          message: `${addedDepts.length} departments added`,
          data: addedDepts,
          existing,
        })
        /*  response.status(201).send({
          message: `${addedDepts.length} departments added`,
          data: addedDepts,
          existing,
          error: false,
        }) */
      }
    } else {
      return responseHandler(
        request,
        response,
        404,
        null,
        "This company isn't registered. Please register"
      )
      /*   response.status(404).json({
        status: 'Unsuccessful',
        message: "This company isn't registered. Please register",
        error: true,
      }) */
    }
  }

  async getDept(request, response) {
    const companyId = parseInt(request.user.id)
    const deptId = parseInt(request.params.deptId)

    const dept = await Department.findOne({
      where: {
        companyId,
        id: deptId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    }).catch(error => {
      return error
    })

    if (!dept) {
      return responseHandler(
        request,
        response,
        404,
        null,
        'This department has not been added'
      )
      /*  response.status(404).json({
        message: 'This department has not been added',
        error: true,
      }) */
    }
    return responseHandler(request, response, 200, {
      status: 'Successful',
      data: dept,
    })
    /* response.status(200).json({
      status: 'Successful',
      data: dept,
      error: false,
    }) */
  }

  async getAllDept(request, response) {
    //d
    const companyId = parseInt(request.user.id)

    const depts = await Department.findAll({
      where: {
        companyId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    }).catch(error => {
      return error
    })

    if (depts.length === 0) {
      return responseHandler(
        request,
        response,
        404,
        null,
        `No department has been added for company ${companyId}`
      )
      /*  response.status(200).json({
        message: `No department has been added for company ${companyId}`,
        error: true,
      }) */
    }
    return responseHandler(request, response, 200, {
      status: 'Successful',
      data: depts,
    })
    /*  response.status(200).json({
      status: 'Successful',
      data: depts,
      error: false,
    }) */
  }

  async updateDept(request, response) {
    //d
    const companyId = parseInt(request.user.id)
    const deptId = parseInt(request.params.deptId)

    const dept = await Department.findOne({
      where: {
        companyId,
        id: deptId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    }).catch(error => {
      return error
    })

    if (dept) {
      const updatedDept = await dept
        .update({
          deptName: request.body.deptName || dept.deptName,
        })
        .catch(error => {
          return error
        })

      return responseHandler(request, response, 200, {
        message: `Successful!! ${dept.deptName} has been updated`,
        data: updatedDept,
      })
      /* response.status(200).send({
        message: `Successful!! ${dept.deptName} has been updated`,
        data: updatedDept,
        error: false,
      }) */
    } else {
      return responseHandler(
        request,
        response,
        404,
        null,
        'This department does not exist'
      )
      /*  response.status(404).json({
        message: 'This department does not exist',
        error: true,
      }) */
    }
  }
}
