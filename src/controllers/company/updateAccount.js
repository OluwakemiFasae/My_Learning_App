import Validator from 'validatorjs';

import { updateRules } from '../../helpers/validatorRules'

require('dotenv').config();
const Company = require('../../models').Company;

import { responseHandler } from '../../helpers/responseHandler';

 
 const updateAccount = async (request, response) => {
    
    const companyId = parseInt(request.user.id)
    const company = await Company.findByPk(companyId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).catch(error => { 
        return error 
    })

    if (company) {
        let validate = new Validator(request.body, updateRules);

        if (validate.passes()) {
            const { companyName, logoUrl, contactNo, address, employeeSize, state, country } = request.body

            const updatedDetails = await company.update({
                companyName: companyName || company.companyName,
                verified: company.verified,
                logoUrl: logoUrl || company.logoUrl,
                contactNo: contactNo || company.contactNo,
                address: address || company.address,
                employeeSize: employeeSize || company.employeeSize,
                state: state || company.state,
                country: country || company.country
            }).catch(error => { 
                return error 
            })

            return responseHandler(
                request, 
                response, 
                200, 
                {
                    message: `Successful!! ${company.companyName} has been updated`,
                    data: updatedDetails,
                }
            )
        } else {
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
            "This company isn't registered. Please register"
          )
    }
}

export default updateAccount