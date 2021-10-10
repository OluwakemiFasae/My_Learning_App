const Department = require('../../models').Department
 
import { responseHandler } from '../../helpers/responseHandler'

 const getDept= async (request, response) => {

    const companyId = parseInt(request.user.id)
    const deptId = parseInt(request.params.deptId)

    const dept = await Department.findOne({
        where: {
            companyId,
            id: deptId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
    }).catch(error => { 
        return error 
    });

    if (!dept) {
        return responseHandler(
            request,
            response,
            404,
            null,
            'This department has not been added'
          )
    }
    return responseHandler(
        request, 
        response, 
        200, 
        {
            status: 'Successful',
            data: dept,
        }
    )
}

export default getDept