const Company = require('../../models').Company

import { responseHandler } from '../../helpers/responseHandler'

const getCompany = async (request, response) => {

    const companyId = parseInt(request.user.id)


    const company = await Company.findOne({
        where: {
            companyId,
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
    }).catch(error => {
        return error
    });

    if (!company) {
        return responseHandler(
            request,
            response,
            404,
            null,
            'This company does not exist'
        )
    }
    return responseHandler(
        request,
        response,
        200,
        {
            message: 'Successful',
            data: company,
        }
    )
}

export default getCompany