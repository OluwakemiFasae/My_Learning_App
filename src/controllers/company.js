import Validator from 'validatorjs';
import jwt from 'jsonwebtoken';
import Mailer from '../services/Mailer'


require('dotenv').config();
const bcrypt = require('bcrypt');

const verifyTemplate = require('../services/Templates/verifyTemplate').default

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

        let validate = new Validator(request.body, companyRules);
        if (validate.passes()) {

            const { companyName, companyEmail, password } = request.body

            const company = await Company.findOne({
                where: {
                    email: companyEmail
                },
            }).catch(error => { return error })


            
            
            if(!company){
                bcrypt.hash(request.body.password, saltRounds, async (err, hash) => {
                    const newCompany = await Company
                        .create({
                            companyName,
                            email: companyEmail,
                            password: hash
                        }).catch(error => { return error })

                    const vToken = jwt.sign(
                        { id: newCompany.id, email: newCompany.email },
                        process.env.VERIFICATION_TOKEN,
                        { expiresIn: "7d" }
                    );

                    const content = `/api/v1/company/verify/${vToken}`
                    //const content = url
                    const recipients = newCompany.email

                    //send email here
                    const newMail = {
                        subject: 'Verify Account',
                        recipients: recipients.split(',').map(email => ({ email: email.trim() })),
                        body: content
                    }

                    const mailer = new Mailer(newMail, verifyTemplate(newMail));

                    try {
                        await mailer.send();
                    } catch (err) {
                        response.status(422).send({
                            message: err
                        });
                    }

                    return response.status(201).send({
                        status: `Successful!! Sent a verification email to ${newCompany.email}`,
                        data: newCompany, vToken,
                        error: false
                    });
                })
            }else{
                return response.status(201).send({
                    status: 'Company exists',
                    error: true
                });
            }
        }
        else {
            return response.status(400).json({
                status: 'Unsuccessful',
                message: 'Invalid data input',
                error: true,
                errors: validate.errors.all(),
            });
        }
    }

    

    async UpdateAccount(request, response) {
        const companyId = parseInt(request.user.id)
        const company = await Company.findByPk(companyId, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
          }}).catch(error => { return error })
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
                }).catch(error => { return error })

                response.status(200).send({
                    message: `Successful!! ${company.companyName} has been updated`,
                    data: updatedDetails,
                    error: false
                });
            } else {
                return response.status(400).json({
                    status: 'Unsuccessful',
                    message: 'Invalid data input',
                    error: true,
                    errors: validate.errors.all(),
                });
            }
        }
        else {
            return response.status(404).json({
                status: 'Unsuccessful',
                error: true,
                message: 'This company isn\'t registered. Please register'
            });
        }
    }

    async AddDept(request, response) {
        const companyId = parseInt(request.user.id)

        const company = await Company.findByPk(companyId).catch(error => { return error })

        if (company) {
            if (!request.body.depts) {
                return response.status(404).json({
                    message: 'Empty data',
                    error: true
                })
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
                    }).catch(error => { return error })

                    if (dpt) {
                        existing.push(dpt.dataValues.deptName)
                        continue;
                    } else {
                        const addedDept = await Department.create({
                            companyId,
                            deptName: dept
                        }).catch(error => { return error });

                        addedDepts.push(addedDept.deptName);
                    }

                }
                return response.status(201).send({
                    message: `${addedDepts.length} departments added`,
                    data: addedDepts, existing,
                    error: false
                });
            }

        }
        else {
            return response.status(404).json({
                status: 'Unsuccessful',
                message: 'This company isn\'t registered. Please register',
                error: true
            });
        }

    }

    async getDept(request, response) {

        const companyId = parseInt(request.user.id)
        const deptId = parseInt(request.params.deptId)

        const dept = await Department.findOne({
            where: {
                companyId,
                id: deptId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
        }).catch(error => { return error });

        if (!dept) {
            return response.status(404).json({
                message: 'This department has not been added',
                error: true
            });
        }
        response.status(200).json({
            status: 'Successful',
            data: dept,
            error: false
        });
    }


    async getAllDept(request, response) {
        //d
        const companyId = parseInt(request.user.id)

        const depts = await Department.findAll({
            where: {
                companyId,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
        }).catch(error => { return error });

        if (depts.length === 0) {
            return response.status(200).json({
                message: `No department has been added for company ${companyId}`,
                error: true
            });
        }
        response.status(200).json({
            status: 'Successful',
            data: depts,
            error: false
        });
    }

    async updateDept(request, response) {
        //d
        const companyId = parseInt(request.user.id)
        const deptId = parseInt(request.params.deptId)

        const dept = await Department.findOne({
            where: {
                companyId,
                id: deptId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
        }).catch(error => { return error });

        if (dept) {
            const updatedDept = await dept.update({
                deptName: request.body.deptName || dept.deptName
            }).catch(error => { return error });

            response.status(200).send({
                message: `Successful!! ${dept.deptName} has been updated`,
                data: updatedDept,
                error: false
            });

        }
        else {
            return response.status(404).json({
                message: 'This department does not exist',
                error: true
            });
        }

    }
}