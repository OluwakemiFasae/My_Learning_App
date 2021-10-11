import Validator from 'validatorjs'
const Training = require('../models').Training
const Company = require('../models').Company

import { responseHandler } from '../helpers/responseHandler'

const trainigRules = {
  companyId: 'required',
  topic: 'required',
  description: 'required',
  unitCost: 'required',
  location: 'required',
  status: 'required',
}
export default class TrainingController {
  async createNewTraining(request, response) {
    const authCompanyId = request.user.id

    const validateCompany = await Company.findOne({
      companyId: authCompanyId,
    })

    if (validateCompany) {
      const {
        companyId,
        topic,
        description,
        startDate,
        endDate,
        unitCost,
        location,
        status,
      } = request.body

      if (validateCompany.dataValues.id != companyId) {
        return responseHandler(request, response, 400)
      }

      let createTraining
      let validateData = new Validator(request.body, trainigRules)

      if (validateData.passes()) {
        createTraining = await Training.create({
          companyId,
          topic,
          description,
          startDate,
          endDate,
          unitCost,
          location,
          status,
        })
      } else {
        return responseHandler(
          request,
          response,
          400,
          null,
          validateData.errors.all()
        )
      }

      return responseHandler(request, response, 201, {
        data: createTraining,
      })

      // =================================================================
    } else {
      return responseHandler(request, response, 422)
    }
  }
}

/* 
 const authCompanyId = request.user.id
  
    const validateCompany = await Company.findOne({
      where: { id: authCompanyId },
    })
    if (validateCompany === null) {
      return responseHandler(request, response, 404)
    } else {
      const createNewTraining = await Training.create({
        companyId,
        topic,
        description,
        startDate,
        endDate,
        unitCost,
        location,
        status,
      }).catch(err => err)
    }
    
   */
