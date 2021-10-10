const Department = require('../../models').Department;

import { responseHandler } from '../../helpers/responseHandler';

 const getAllDept = async(request, response) => {
    
    const companyId = parseInt(request.user.id)

    const depts = await Department.findAll({
        where: {
            companyId,
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
    }).catch(error => { 
        return error 
    });

    if (depts.length === 0) {
        return responseHandler(
            request,
            response,
            404,
            null,
            `No department has been added for company ${companyId}`
          )
    }
    return responseHandler(
        request, 
        response, 
        200, 
        {
            status: 'Successful',
            data: depts,
        }
    )
}

export default getAllDept