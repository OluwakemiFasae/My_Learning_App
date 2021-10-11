import Validator from 'validatorjs'
const Training = require('../../models').Training
const Company = require('../../models').Company

import { trainingRules } from '../../helpers/validatorRules'
import { responseHandler } from '../../helpers/responseHandler'

const createNewTraining = async (request, response) => {
    const authCompanyId = parseInt(request.user.id)

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
        let validateData = new Validator(request.body, trainingRules)

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
            data: createTraining,
        })
    } else {
        return responseHandler(request, response, 401)
    }
}

export default createNewTraining