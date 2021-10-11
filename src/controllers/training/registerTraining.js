import Validator from 'validatorjs'
const Training = require('../../models').Training
const Company = require('../../models').Company

import { trainigRules } from '../../helpers/validatorRules'
import { responseHandler } from '../../helpers/responseHandler'

export default class TrainingController {
    async createNewTraining(request, response) {
        const authCompanyId = request.user.id

        const validateCompany = await Company.findOne({
            companyId: authCompanyId
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
            const training = await Training.findOne({
                where: {
                    companyId: authCompanyId
                }
                , attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            return responseHandler(request, response, 201, {
                data: training,
            })
        } else {
            return responseHandler(request, response, 401)
        }
    }
}
