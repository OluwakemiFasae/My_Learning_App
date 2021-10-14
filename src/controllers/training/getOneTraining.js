const Training = require('../../models').Training
const Company = require('../../models').Company
const Training_Application = require('../../models').Training_Application
const Employee = require('../../models').Employee
const Review = require('../../models').Review


import { responseHandler } from '../../helpers/responseHandler'

/* 
- Validate Company ID
- Validate Training ID
- Employees that applied from Training Application Table
- Training Information
- Reviews attached to training
   - Employees that reviewed
- Remove all clutters on response
- Handle all known errors
 */
const getOneTraining = async (request, response) => {
    const companyId = parseInt(request.user.id)
    const id = parseInt(request.params.id)
    if (!companyId) {
        return responseHandler(request, request, 401)
    } else {
        const validateTraining = await Training.findAll({
            where: { id },
            include: [{
                model: Training_Application, include: [{
                    model: Employee, attributes: { exclude: ['password', 'verified', 'createdAt', 'updatedAt'] }
                }]
            }]
        })

        const checkReview = await Review.findAll()
        console.log(checkReview)
        return responseHandler(request, response, 200, { data: validateTraining })
    }
}

export default getOneTraining

/*  const training = await Training.findByPk(trainingId, {
        where: { id: trainingId },
        include: {
            Training_Application: {
                where: { trainingId }
            }
        }

    }) */