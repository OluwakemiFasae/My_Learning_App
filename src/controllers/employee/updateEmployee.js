 import { employeeRules } from '../../helpers/validatorRules'

 import { responseHandler } from '../../helpers/responseHandler';
 
 
 const updateEmployee = async (request, response) => {

    const empId = parseInt(request.params.empId)

    const empl = await Employee.findByPk(empId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
    }).catch(error => { 
        return error 
    });

    if (empl) {
        const { firstname, lastname, email, phoneNo, deptId, jobtitle } = request.body

        let validate = new Validator(request.body, employeeRules);
        let updatedEmpl;
        
        if (validate.passes()) {
            updatedEmpl = await empl.update({
                firstname: firstname || empl.firstname,
                lastname: lastname || empl.lastname,
                email: email || empl.email,
                phoneNo: phoneNo || empl.phoneNo,
                deptId: deptId || empl.deptId,
                jobtitle: jobtitle || empl.jobtitle
            }).catch(error => { 
                return error 
            });

            return responseHandler(
                request, 
                response, 
                200, 
                {
                    message: `Successful!! ${firstname} has been updated`,
                    data: updatedEmpl,
                }
            )
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

export default updateEmployee