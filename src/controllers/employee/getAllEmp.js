
const Employee = require('../../models').Employee;
const Department = require('../../models').Department;

import { responseHandler } from '../../helpers/responseHandler';


const getAll = async (request, response) => {
    const companyId = parseInt(request.user.id)

    const empls = await Employee.findAll({
        include: [{
            model: Department,
            as: 'Department',
            where: {
                companyId
            },
            attributes: ['deptName']
        }
        ],
        attributes: {
            exclude: ['deptId', 'password','createdAt', 'updatedAt']
        },
    }).catch(error => { 
        return error 
    });

    
    if (empls.length === 0) {
        
        return responseHandler(
            request,
            response,
            404,
            null,
            `No employee has been added for this company`
          )
    }
    return responseHandler(
        request, 
        response, 
        200, 
        {
            status: 'Successful',
            data: empls,
        }
    )
}

export default getAll