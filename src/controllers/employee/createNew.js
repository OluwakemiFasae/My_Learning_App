import Validator from 'validatorjs'

const bcrypt = require('bcrypt')

const Employee = require('../../models').Employee
const Company = require('../../models').Company

import { saltRounds } from '../../helpers/constants'
import { employeeRules } from '../../helpers/validatorRules'

import { responseHandler } from '../../helpers/responseHandler'

const createNew = async (request, response) => {

    const companyId = parseInt(request.user.id)
    const company = await Company.findByPk(companyId).catch(error => {
        return error
    })

    if (company) {
        
        const { employees } = request.body
        
        if (!employees) {
            return responseHandler(request, response, 422)
        }


        let addedEmployees = []
        let existing = []

        for (let employee of employees) {

            const empl = await Employee.findOne({
                where: {
                    email: employee.email,
                },

            })

            console.log(empl)

            if (empl) {
                existing.push(empl.dataValues.email)
                continue;
            }

            const password = Math.random().toString(36).substring(2, 8)

            const hashed = await bcrypt.hash(password, saltRounds)

            employee.hashed = hashed

            let validate = new Validator(employee, employeeRules);
            let addedEmployee;

            if (validate.passes()) {
                addedEmployee = await Employee.create({
                    firstname: employee.firstname,
                    lastname: employee.lastname,
                    email: employee.email,
                    password: employee.hashed,
                    verified: true,
                    phoneNo: employee.phoneNo,
                    deptId: employee.deptId,
                    jobtitle: employee.jobtitle
                }).catch(error => {
                    return error
                });

                addedEmployee.dataValues.unhashedpassword = password;

                addedEmployees.push(addedEmployee.dataValues);
            }else {
                return responseHandler(
                    request,
                    response,
                    400,
                    null,
                    validate.errors.all()
                )
            }
        }

                return responseHandler(
                    request,
                    response,
                    201,
                    {
                        message: `Successful!! ${addedEmployees.length} employees added`,
                        data: addedEmployees, existing,
                    }
                )
             
        }
     else {
        return responseHandler(
            request,
            response,
            404,
            null,
            "This company isn't registered. Please register"
        )
    }

}

export default createNew