import Validator from 'validatorjs';
require('dotenv').config();
const bcrypt = require('bcrypt');

const Company = require('../models').Company;
const Department = require('../models').Department;



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

    async createAccount(request, response) {
        const company = await Company.findOne({
            where: {
                email: request.body.companyEmail,
            },
        }).catch(error => { return error })
        if (!company) {
            let validate = new Validator(request.body, companyRules);
            if (validate.passes()) {
                bcrypt.hash(request.body.password, saltRounds, async (err, hash) => {
                    const newCompany = await Company
                        .create({
                            companyName: request.body.companyName,
                            email: request.body.companyEmail,
                            password: hash,
                        }).catch(error => { return error })
                    return response.status(201).send({
                        status: 'Successful',
                        data: newCompany,
                    });
                })
            } else {
                return response.status(400).json({
                    status: 'Unsuccessful',
                    message: 'Invalid data input',
                    errors: validate.errors.all(),
                });
            }
        } else {
            return response.status(400).send({
                message: 'This email has been used for a registered company!'
            });
        }
    }

    async UpdateAccount(request, response) {
        const companyId = parseInt(request.user.id)
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

    async AddDept(request, response) {
        const companyId = parseInt(request.user.id)
        const company = await Company.findByPk(companyId).catch(error => { return error })
        if (company) {
            const depts = request.body.depts
            let addedDepts = []
            let existing = []

            for (let dept of depts) {
                
                const dpt = await Department.findOne({
                    where: {
                        companyId,
                    },
                }).catch(error => { return error })

                if(dpt){
                    existing.push(dpt.dataValues.deptName)
                    continue;
                }else{
                    const addedDept = await Department.create({
                        companyId,
                        deptName: dept
                    }).catch(error => { return error });
                    
                    addedDepts.push(addedDept);
                }
                
            }
            return response.status(201).send({
                message: `${addedDepts.length} departments added`,
                data: addedDepts, existing
            });
        } else {
            return response.status(404).json({
                status: 'Unsuccessful',
                message: 'This company isn\'t registered. Please register'
            });
        }

    }

    async getDept(request, response){
        
        const companyId = parseInt(request.user.id)
        const deptId = parseInt(request.params.deptId)

        const dept = await Department.findOne({
            where: {
                companyId,
                id: deptId
            }
        }).catch(error => { return error });
    
        if (!dept) {
          return response.status(404).json({
            message: 'This department has not been added'
          });
        }
        response.status(200).json({
          status: 'Successful',
          data: dept
        });
      }
    

    async getAllDept(request, response){
        //d
        const companyId = parseInt(request.user.id)

        const depts = await Department.findAll({
            where: {
                companyId,
            }
        }).catch(error => { return error });
    
        if (depts.length === 0) {
          return response.status(200).json({
            message: `No department has been added for company ${companyId}`
          });
        }
        response.status(200).json({
          status: 'Successful',
          data: depts
        });
      }

    async updateDept(request, response){
        //d
        const companyId = parseInt(request.user.id)
        const deptId = parseInt(request.params.deptId)

        const dept = await Department.findOne({
            where: {
                companyId,
                id: deptId
            }
        }).catch(error => { return error });
    
        if (dept){
            const updatedDept = await dept.update({
                deptName: request.body.deptName || dept.deptName
            }).catch(error => { return error });

            response.status(200).send({
                message: `Successful!! ${dept.deptName} has been updated`,
                data: updatedDept
            });

        }
        else {
          return response.status(404).json({
            message: 'This department does not exist'
          });
        }
        
    }
}