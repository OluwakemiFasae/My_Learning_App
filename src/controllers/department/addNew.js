const Company = require('../../models').Company;
const Department = require('../../models').Department;

import { responseHandler } from '../../helpers/responseHandler';

 const addDept = async (request, response) => {
    const companyId = parseInt(request.user.id)

    const company = await Company.findByPk(companyId).catch(error => { 
        return error 
    })

    if (company) {
        if (!request.body.depts) {
            return responseHandler(request, response, 204)
        }
        else {

            const depts = request.body.depts
            let addedDepts = []
            let existing = []

            for (let dept of depts) {

                const dpt = await Department.findOne({
                    where: {
                        companyId,
                        deptName: dept
                    },
                }).catch(error => { 
                    return error 
                })

                if (dpt) {
                    existing.push(dpt.dataValues.deptName)
                    continue;
                } else {
                    const addedDept = await Department.create({
                        companyId,
                        deptName: dept
                    }).catch(error => { 
                        return error 
                    });

                    addedDepts.push(addedDept.deptName);
                }

            }
            return responseHandler(
                request, 
                response, 
                201, 
                {
                    message: `${addedDepts.length} departments added`,
                    data: addedDepts,
                    existing,
                }
            )
        }

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

export default addDept