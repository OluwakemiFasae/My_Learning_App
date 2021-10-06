import Validator from 'validatorjs';

const bcrypt = require('bcrypt');

const Employee = require('../models').Employee;
const Department = require('../models/').Department;
const Company = require('../models').Company;

const saltRounds = 10;

const employeeRules = {
    firstname: 'required|min:3',
    lastname: 'required|min:3',
    email: 'required|email',
    password: 'required|min:3',
    deptId: 'required',
    jobtitle: 'required|min:3'
};

export default class EmployeeController {
    async createNew(request, response) {

        const companyId = parseInt(request.user.id)
        const company = await Company.findByPk(companyId).catch(error => { return error })

        if (company) {
            const { employees } = request.body
            if (!employees) {
                return response.status(404).json({
                    status: 'Unsuccessful',
                    message: 'Invalid Input',
                    error: true
                });
            }

            //console.log((request.body.employees).length)
            let addedEmployees = []
            let existing = []

            for (let employee of employees) {

                const empl = await Employee.findOne({
                    where: {
                        email: employee.email,
                    },

                })

                if (empl) {
                    existing.push(empl.dataValues.email)
                    continue;
                }
                const password = Math.random().toString(36).substring(2, 8)

                const hashed = await bcrypt.hash(password, saltRounds)

                let validate = new Validator(request.body, employeeRules);
                let addedEmployee;

                if (validate.passes()) {
                    addedEmployee = await Employee.create({
                        firstname: employee.firstname,
                        lastname: employee.lastname,
                        email: employee.email,
                        password: hashed,
                        verified: true,
                        phoneNo: employee.phoneNo,
                        deptId: employee.deptId,
                        jobtitle: employee.jobtitle
                    }).catch(error => { return error });
                } else {
                    return response.status(400).json({
                        status: 'Unsuccessful',
                        message: 'Invalid data input',
                        error: true,
                        errors: validate.errors.all(),
                    });
                }

                addedEmployee.dataValues.unhashedpassword = password;

                addedEmployees.push(addedEmployee.dataValues);

            }

            return response.status(201).send({
                message: `${addedEmployees.length} employees added`,
                data: addedEmployees, existing,
                error: false
            })
        } else {
            return response.status(404).json({
                status: 'Unsuccessful',
                message: 'This company isn\'t registered. Please register',
                error: true
            });
        }

    }

    async getAll(request, response) {
        const companyId = parseInt(request.user.id)

        const empls = await Employee.findAll({
            include: [{
                model: Department,
                as: 'Department',
                where: {
                    companyId
                },
                attributes: ['deptName']
            }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        }).catch(error => { return error });

        if (empls.length === 0) {
            return response.status(200).json({
                message: `No employee has been added for company ${companyId}`,
                error: true
            });
        }
        response.status(200).json({
            status: 'Successful',
            data: empls,
            error: false
        });
    }

    async getOne(request, response) {
        const companyId = parseInt(request.user.id)
        const empId = parseInt(request.params.empId)

        let empl = await Employee.findByPk(empId, {
            include: [{
                model: Department,
                as: 'Department',
                where: {
                    companyId
                },
                attributes: ['deptName']
            }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        }).catch(error => { return error });

        if (empl) {
            return response.status(200).json({
                status: 'Successful',
                data: empl,
                error: false
            });
        }

        else {
            return response.status(404).json({
                message: 'This employee does not exist',
                error: true
            });
        }


    }

    async updateEmployee(request, response) {

        const empId = parseInt(request.params.empId)

        const empl = await Employee.findByPk(empId, {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        }).catch(error => { return error });

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
            }).catch(error => { return error });

            response.status(200).send({
                message: `Successful!! ${firstname} has been updated`,
                data: updatedEmpl,
                error: false
            });
        }else {
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
                message: 'This employee hasn\'t been added',
                error: true
            });
        }
    }

    async deleteEmployee(request, response) {
        const empId = parseInt(request.params.empId)

        const empl = await Employee.findByPk(empId).catch(error => { return error });

        if (empl) {
            await empl.destroy().catch(error => { return error });
            response.status(200).send({
                message: `${empl.firstname} has been deleted`,
                error: false
            })
        }
        else {
            return response.status(404).json({
                message: 'This employee does not exist',
                error: true
            });
        }

    }
    async resetEmployee(request, response) {
        const newPassword = Math.random().toString(36).substring(2, 8)
        const hashed = await bcrypt.hash(newPassword, saltRounds)

        const companyId = parseInt(request.user.id)

        const empId = parseInt(request.params.empId)


        const empl = await Employee.findByPk(empId).catch(error => { return error });

        if (empl) {
            const newPass = await empl.update({
                password: hashed
            }).catch(error => { return error });

            newPass.dataValues.unhashedpassword = newPassword;

            response.status(200).send({
                message: `Successful!! ${empl.firstname}'s password has been changed`,
                data: newPass
            });

        }
        else {
            return response.status(404).json({
                message: 'This employee hasn\'t been added'
            });
        }
    }
}