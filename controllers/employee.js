const bcrypt = require('bcrypt');

const Employee = require('../models').Employee;
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
                console.log(hashed)
                    
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

    async getAll (req, res){
        
    }

    async getOne (req, res){
        
    }

    async generateNewPassword(){

    }
}