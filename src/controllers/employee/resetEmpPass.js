const bcrypt = require('bcrypt')

import { saltRounds } from '../../helpers/constants'

import { responseHandler } from '../../helpers/responseHandler'

const resetEmployee = async (request, response) => {
    
    const newPassword = Math.random().toString(36).substring(2, 8)

    const hashed = await bcrypt.hash(newPassword, saltRounds)

    const empId = parseInt(request.params.empId)


    const empl = await Employee.findByPk(empId).catch(error => { 
        return error 
    });

    if (empl) {
        const newPass = await empl.update({
            password: hashed
        }).catch(error => { 
            return error 
        });

        newPass.dataValues.unhashedpassword = newPassword;

        return responseHandler(
            request, 
            response, 
            200, 
            {
                message: `Successful!! ${empl.firstname}'s password has been changed`,
                data: newPass,
            }
        )

    }
    else {
        return responseHandler(
            request,
            response,
            404,
            null,
            "This employee hasn't been added"
          )
    }
}

export default resetEmployee