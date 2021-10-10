const Employee = require('../../models').Employee

import { responseHandler } from '../../helpers/responseHandler';
 
const deleteEmployee = async(request, response) => {
    const empId = parseInt(request.params.empId)

    const empl = await Employee.findByPk(empId).catch(error => { 
        return error 
    });

    if (empl) {
        await empl.destroy().catch(error => { 
            return error 
        });
        return responseHandler(
            request, 
            response, 
            200, 
            {
                status: 'Successful',
                message: `${empl.firstname} has been deleted`,
            }
        )
    }
    else {
        return responseHandler(
            request,
            response,
            404,
            null,
            'This employee does not exist'
          )
    }

}

export default deleteEmployee