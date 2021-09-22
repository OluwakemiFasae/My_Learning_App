const Admin = require('../models').Admin;

export default class AdminController {
    static createAccount(request, response) {
        console.log(request.body)
        Admin
          .findOne({
            where: {
              email: request.body.email,
            },
          })
          .then((admin) => {
            if (!admin) {
                  return Admin
                    .create({
                      firstname: request.body.firstname,
                      lastname: request.body.lastname,
                      email: request.body.email,
                      password: request.body.password,
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
              }  else {
              return response.status(400).send({
                status: 'Found',
                message: 'User already exists!'
              });
            }
          })
          .catch(error => response.status(500).send(error.toString()));
      }
}

