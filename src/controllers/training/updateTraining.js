import Validator from 'validatorjs'
const Training = require('../../models').Training
const Company = require('../../models').Company

import { updateTrainingRules } from '../../helpers/validatorRules'
import { responseHandler } from '../../helpers/responseHandler'


const updateTraining = async (request, response) => {
    const id = parseInt(request.params.id)

    const training = await Training.findByPk(id, {
        attributes: {
            exclude: ['createdAt']
        }
    })
    if (training) {
        const {
            topic,
            description,
            startDate,
            endDate,
            unitCost,
            location,
            status,
        } = request.body

        // Validate body data
        let validate = new Validator(request.body, updateTrainingRules)

        if (validate.passes()) {
            training.changed('updatedAt', true) //change updated tome
            const updateTraining = await training.update({
                topic: topic || training.topic,
                description: description || training.description,
                startDate: startDate || training.startDate,
                endDate: endDate || training.endDate,
                unitCost: unitCost || training.unitCost,
                location: location || training.location,
                status: status || training.status,
                updatedAt: new Date()
            })

            return responseHandler(request, response, 200, {
                data: updateTraining
            })
        } else {
            return responseHandler(request, response, 400, null, validate.errors.all())
        }
    } else {
        return responseHandler(
            request,
            response,
            422,

        )
    }


}
export default updateTraining
/*
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
    } */