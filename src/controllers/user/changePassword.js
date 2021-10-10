import { saltRounds } from '../../helpers/constants';

import { responseHandler } from '../../helpers/responseHandler';

const bcrypt = require('bcrypt');


const Company = require('../../models').Company;
const Employee = require('../../models').Employee;


const changePassword = async (request, response) => {
    //
    const { oldPassword, newPassword } = request.body

    const id = parseInt(request.user.id)
    let user

    try {
        // Find user with matching ID

        user = await Company.findByPk(id)

        if (!user) {
            user = await Employee.findByPk(id)


            if (!user) {
                return responseHandler(
                    request,
                    response,
                    404,
                    null,
                    'User does not  exists'
                  )
            }
        }

        bcrypt.compare(
            oldPassword,
            user.dataValues.password,
            (err, resp) => {
                if (resp === false) {
                    return responseHandler(
                        request,
                        response,
                        403,
                        null,
                        'Invalid credentials'
                      )
                }
                bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
                    const newUpdate = await user.update({
                        password: hash
                    })
    
                    return responseHandler(
                        request, 
                        response, 
                        200, 
                        {
                            message: `Successful!! Your password has been changed`,
                        }
                    )
                })
                
            }); 
    }catch (err) {
        return responseHandler(request, response, 500, null, err)
    }

}

export default changePassword