require('dotenv').config();

const Admin = require('../models').Admin;



export default class AdminController {
    async createAccount(request, response) {
         
            // const existingAdmin = await Admin.findOne({
            //     where: {
            //     email: request.body.email,
            //     }}).catch(error => response.send({
            //         status: 'Success',
            //         error: error.toString(),
            //       }));
            // if(!existingAdmin){
            //     const newAdmin = await Admin
            //         .create({
            //           firstname: request.body.firstname,
            //           lastname: request.body.lastname,
            //           email: request.body.email,
            //           password: request.body.password,
            //           companyId: request.body.companyId
            //         }).catch(error => response.send({
            //             status: 'Success',
            //             error: error.toString(),
            //           }));
            
            //     delete newAdmin.dataValues.password;
            //     return response.status(201).send({
            //         status: 'Successful',
            //         data: newAdmin,
            //     })
                
                            
            // }else{
            //     return response.status(400).send({
            //         status: 'Found',
            //         message: 'User already exists!'
            //   });
            // }
        
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