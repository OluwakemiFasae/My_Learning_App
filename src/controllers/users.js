import Validator from 'validatorjs';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');

const Company = require('../models').Company;
const Employee = require('../models').Employee;

const loginRules = {
    email: 'required|email',
    password: 'required',
};


export default class UserController {

    async login(request, response) {
        
        const validate = new Validator(request.body, loginRules);
        
        if (validate.passes()) {
          let user = await Company
            .findOne({
              where: {
                email: request.body.email
              }
            }).catch(error => { return error })
            
            if(user){
              user.dataValues.admin = 'true'
            }else{
              user = await Employee.findOne({
                where: {
                  email: request.body.email
                }
              }).catch(error => { return error })
            
                  if(user){
                    user.dataValues.admin = 'false'
                  }
                  else{
                    return response.status(404).json({
                        status: 'Unsuccessful',
                        message: 'User not found',
                      });
                  }
                }

				if(!user.verified){
					return response.status(403).send({ 
						  message: "Please verify your Account." 
					});
			   }
            bcrypt.compare(
                  request.body.password,
                  user.dataValues.password, 
                  (err, resp) => {
                    if (resp === false) {
                      return response.status(401).send({
                        message: 'Wrong Password',
                      });
                    }
                    const token = jwt.sign(
                      { id: user.dataValues.id, email: user.dataValues.email },
                      process.env.JWT_SECRET, { expiresIn: "3d" });
                    delete user.dataValues.password;
                    return response.status(200).send({
                      message: 'login successful', user, token
                    });
                  });
              }
            else{
                return response.status(400).json({
                    status: 'Unsuccessful',
                    message: 'Invalid data input',
                    errors: validate.errors.all(),
                });
            }
        }

        getCurrentUser (request,response){
          return response.send(request.user);
      }
}