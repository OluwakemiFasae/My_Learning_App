const Department = require('../../models').Department;

import { responseHandler } from '../../helpers/responseHandler';

const updateDept = async (request, response) => {
    
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

    if (dept) {
        const updatedDept = await dept.update({
            deptName: request.body.deptName || dept.deptName
        }).catch(error => { return error });

        return responseHandler(
            request, 
            response, 
            200, 
            {
                message: `Successful!! ${dept.deptName} has been updated`,
                data: updatedDept,
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

export default updateDept