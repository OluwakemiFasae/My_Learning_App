import Validator from 'validatorjs';
require('dotenv').config();
const bcrypt = require('bcrypt');
const Admin = require('../models').Admin;



const saltRounds = 10;

const adminRules = {
    firstname: 'required|between:3,20',
    lastname: 'required|between:3,25',
    email: 'required|email',
    password: 'required|min:8',
};


export default class AdminController {
    async createAccount(request, response) {
        Admin
            .findOne({
                where: {
                    email: request.body.email,
                },
            })
            .then((admin) => {
                if (!admin) {
                    let validate = new Validator(request.body, adminRules);

                    if (validate.passes()) {
                        bcrypt.hash(request.body.password, saltRounds, (err, hash) => {
                            return Admin
                                .create({
                                    firstname: request.body.firstname,
                                    lastname: request.body.lastname,
                                    email: request.body.email,
                                    password: hash,
                                    companyId: request.body.companyId
                                })
                                .then((newAdmin) => {
                                    delete newAdmin.dataValues.password;
                                    response.status(201).send({
                                        status: 'Successful',
                                        data: newAdmin,
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
                        status: 'Found',
                        message: 'User already exists!'
                    });
                }
            })
            .catch(error => response.status(500).send(error.toString()));
    }

}