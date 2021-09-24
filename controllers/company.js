import Validator from 'validatorjs';
require('dotenv').config();
const bcrypt = require('bcrypt');
const Company = require('../models').Company;



const saltRounds = 10;

const companyRules = {
    companyName: 'required|min:3',
    companyEmail: 'required|email',
    password: 'required|min:5',
};

const updateRules = {
    companyName: 'required|min:3',
    logoUrl: 'required|min:3',
    contactNo: 'required|min:8',
    address: 'required|min:5',
    employeeSize: 'required',
    state: 'required',
    country: 'required'
}
export default class CompanyController {
    createAccount(request, response) {
        Company
            .findOne({
                where: {
                    email: request.body.companyEmail,
                },
            })
            .then((company) => {
                if (!company) {
                    let validate = new Validator(request.body, companyRules);

                    if (validate.passes()) {
                        bcrypt.hash(request.body.password, saltRounds, (err, hash) => {
                            return Company
                                .create({
                                    companyName: request.body.companyName,
                                    email: request.body.companyEmail,
                                    password: hash,
                                })
                                .then((newCompany) => {
                                    delete newCompany.dataValues.password;
                                    response.status(201).send({
                                        status: 'Successful',
                                        data: newCompany,
                                    });
                                })
                                .catch(error => response.send({
                                    status: 'Success',
                                    error: error.toString(),
                                }));
                        })
                    } else {
                        return response.status(400).json({
                            status: 'Unsuccessful',
                            message: 'Invalid data input',
                            errors: validate.errors.all(),
                        });
                    }
                }
                else {
                    return response.status(400).send({
                        message: 'This email has been used for a registered company!'
                    });
                }
            })
            .catch(error => response.status(500).send(error.toString()));
    }

    async UpdateAccount(request, response) {
        const companyId = parseInt(request.params.companyId)
        const company = await Company.findByPk(companyId).catch(error => { return error })
        if (company) {
            let validate = new Validator(request.body, updateRules);

            if (validate.passes()) {
                const updatedDetails = await company.update({
                    companyName: request.body.companyName || company.companyName,
                    verified: company.verified,
                    logoUrl: request.body.logoUrl || company.logoUrl,
                    contactNo: request.body.contactNo || company.contactNo,
                    address: request.body.address || company.address,
                    employeeSize: request.body.employeeSize || company.employeeSize,
                    state: request.body.state || company.state,
                    country: request.body.country || company.country
                }).catch(error => { return error })

                response.status(200).send({
                    message: `Successful!! ${company.companyName} has been updated`,
                    data: updatedDetails
                });
            } else {
                return response.status(400).json({
                    status: 'Unsuccessful',
                    message: 'Invalid data input',
                    errors: validate.errors.all(),
                });
            }
        }
        else {
            return response.status(404).json({
                status: 'Unsuccessful',
                message: 'This company isn\'t registered. Please register'
            });
        }
    }

}