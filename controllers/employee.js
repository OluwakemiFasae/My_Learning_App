const bcrypt = require('bcrypt');

const Employee = require('../models').Employee;
const Department = require('../models/').Department;
const Company = require('../models').Company;

const saltRounds = 10;

export default class EmployeeController {
    async createNew (request, response){

        const companyId = parseInt(request.user.id)
        const company = await Company.findByPk(companyId).catch(error => { return error })
        if (company) {

            const employees = request.body.employees
            //console.log((request.body.employees).length)
            let addedEmployees = []
            let existing = []

            for (let employee of employees) {
    
                const empl = await Employee.findOne({
                    where: {
                        email: employee.email,
                    },
                })

                if(empl){
                    existing.push(empl.dataValues.email)
                    continue;
                }
                const password = Math.random().toString(36).substring(2,8)
                
                const hashed = await bcrypt.hash(password, saltRounds)
                    
                const addedEmployee = await Employee.create({
                    firstname: employee.firstname,
                    lastname: employee.lastname,
                    email: employee.email,
                    password: hashed,
                    phoneNo: employee.phoneNo,
                    deptId: employee.deptId,
                    jobtitle: employee.jobtitle
                }).catch(error => { return error });
               
                addedEmployee.dataValues.unhashedpassword = password;

                addedEmployees.push(addedEmployee.dataValues);
       
        }
        
            return response.status(201).send({
                message: `${addedEmployees.length} employees added`,
                data: addedEmployees, existing
            })
    }else {
            return response.status(404).json({
                status: 'Unsuccessful',
                message: 'This company isn\'t registered. Please register'
            });
        }
        
    }

    async getAll (request, response){
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
        }).catch(error => { return error });
    
        if (empls.length === 0) {
          return response.status(200).json({
            message: `No employee has been added for company ${companyId}`
          });
        }
        response.status(200).json({
          status: 'Successful',
          data: empls
        });
    }

    async getOne (request, response){
        const companyId = parseInt(request.user.id)
        const empId = parseInt(request.params.empId)

        let empl = await Employee.findByPk( {
            // where: {
            //     id:empId
            // },
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
    
        if (!empl) {
          return response.status(404).json({
            message: 'This employee has not been added'
          });
        }
        
        response.status(200).json({
          status: 'Successful',
          data: empl
        });
    }

    async updateEmployee(request, response){
        const companyId = parseInt(request.user.id)

        const empId = parseInt(request.params.empId)

        const empl = await Employee.findOne( {
            where: {
                id:empId
            },
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
    
        if (empl){
            const updatedEmpl = await empl.update({
                firstname: request.body.firstname || empl.firstname,
                lastname: request.body.lastname || empl.lastname,
                email: request.body.email || empl.email,
                phoneNo: request.body.phoneNo || empl.phoneNo,
                deptId: request.body.deptId || empl.deptId,
                jobtitle: request.body.jobtitle || empl.jobtitle
            }).catch(error => { return error });

            response.status(200).send({
                message: `Successful!! ${empl.firstame} has been updated`,
                data: updatedEmpl
            });

        }
        else {
          return response.status(404).json({
            message: 'This employee hasn\'t been added'
          });
        }
    }

    async generateNewPassword(request, response){
        const newPassword = Math.random().toString(36).substring(2,8)
        const hashed = await bcrypt.hash(newPassword, saltRounds)

        const empl = await Employee.findOne( {
            where: {
                id:empId
            },
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
    
        if (empl){
            const newPass = await empl.update({
                password: hashed
            }).catch(error => { return error });

           newPass.dataValues.unhashedpassword = newPassword;

            response.status(200).send({
                message: `Successful!! ${empl.firstame}'s password has been changed`,
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