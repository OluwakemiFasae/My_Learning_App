const Department = require('../../models').Department

import { responseHandler } from '../../helpers/responseHandler';
 
const deleteDept = async(request, response) => {
    const id = parseInt(request.params.id)

    const dept = await Department.findByPk(id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    if (dept) {
        await dept.destroy().catch(error => { 
            return error 
        });
        return responseHandler(
            request, 
            response, 
            200, 
            {
                status: 'Successful',
                message: `${dept.deptName} has been deleted`,
            }
        )
    }
    else {
        return responseHandler(
            request,
            response,
            404,
            null,
            'This department does not exist'
          )
    }

}

export default deleteDept