const Employee = require('../../models').Employee;
const Department = require('../../models').Department;

import { responseHandler } from '../../helpers/responseHandler';
 
 
 const getOne = async (request, response) => {
    const companyId = parseInt(request.user.id)
    const empId = parseInt(request.params.empId)

    let empl = await Employee.findByPk(empId, {
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
            exclude: ['deptId', 'password', 'createdAt', 'updatedAt', 'deletedAt']
        }
    }).catch(error => { 
        return error 
    });

    if (empl) {
        return responseHandler(
            request, 
            response, 
            200, 
            {
                status: 'Successful',
                data: empl,
            }
        )
    } else {
        return responseHandler(
            request,
            response,
            404,
            null,
            'This employee does not exist'
          )
    }


}

export default getOne