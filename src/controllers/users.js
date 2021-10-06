import Validator from 'validatorjs';
import jwt from 'jsonwebtoken';
import Mailer from '../services/Mailer'
const bcrypt = require('bcrypt');


const Company = require('../models').Company;
const Employee = require('../models').Employee;

const resetPwdTemplate = require('../services/Templates/resetPwdTemplate').default

const saltRounds = 10;

const loginRules = {
	email: 'required|email',
	password: 'required',
};

const resetRules = {
	email: 'required|email'
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

			if (user) {
				user.dataValues.admin = 'true'
			} else {
				user = await Employee.findOne({
					where: {
						email: request.body.email
					}
				}).catch(error => { return error })

				if (user) {
					user.dataValues.admin = 'false'
				}
				else {
					return response.status(404).json({
						status: 'Unsuccessful',
						message: 'User not found',
					});
				}
			}

			if (!user.verified) {
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
		else {
			return response.status(400).json({
				status: 'Unsuccessful',
				message: 'Invalid data input',
				errors: validate.errors.all(),
			});
		}
	}

	getCurrentUser(request, response) {
		return response.send(request.user);
	}

	async resetEmail(request, response) {
		const { email } = request.body

		const validate = new Validator(request.body, resetRules);
		let user;

		if (validate.passes()) {

			user = await Company
				.findOne({
					where: {
						email
					}
				}).catch(error => { return error })

			if (!user) {
				console.log('I should not get here o')
				user = await Employee.findOne({
					where: {
						email
					}
				}).catch(error => { return error })

				if (!user) {
					return response.status(404).json({
						status: 'Unsuccessful',
						message: 'User not found',
					});
				}
			}


			const pwToken = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.VERIFICATION_TOKEN,
				{ expiresIn: "7d" }
			);

			const content = `api/v1/company/resetpwd/${pwToken}`

			const recipients = user.email

			//send email here
			const newMail = {
				subject: 'Reset your Password',
				recipients: recipients.split(',').map(email => ({ email: email.trim() })),
				body: content
			}

			const mailer = new Mailer(newMail, resetPwdTemplate(newMail));

			try {
				await mailer.send();
			} catch (err) {
				response.status(422).send({
					message: err
				});
			}

			return response.status(201).send({
				message: `A reset password link has been sent to your email - ${user.email}`,
				data: user, pwToken,
				error: false
			});
		}
		else {
			return response.status(404).send({
				status: 'Invalid email',
				error: true,
				errors: validate.errors.all(),
			});
		}
	}

	async resetPassword(request, response) {
		//
		const { token } = request.params
		const { newPassword } = request.body

		if (!newPassword) {
			return response.status(422).send({
				message: "Please enter a password"
			});
		}

		// Check we have an id
		if (!token) {
			return response.status(422).send({
				message: "Missing Token"
			});
		}


		//Verify the token from the URL
		let payload = null
		try {
			payload = jwt.verify(
				token,
				process.env.VERIFICATION_TOKEN
			);

		} catch (err) {
			return response.status(500).send(err);
		}

		let user
		try {
			// Find user with matching ID
			user = await Company.findOne({
				where: {
					email: payload.email,
				}
			})

			if (!user) {
				user = await Employee.findOne({
					where: {
						email: payload.email
					}
				})

				if (!user) {
					return response.status(404).send({
						message: "User does not  exists"
					});
				}
			}

			bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
				const newUpdate = await user.update({
					password: hash
				})

				return response.status(200).send({
					message: `Successful!! Your password has been changed`,
					error: false,
					data: newUpdate.dataValues.password

				});
			})

		} catch (err) {
			console.log(err)
			return response.status(500).send(err);
		}

	}

	async changePassword(request, response) {
		//
		const { oldPassword, newPassword } = request.body

		const id = parseInt(request.user.id)
		let user

		try {
			// Find user with matching ID

			user = await Company.findByPk(id, {
				where: {
					id,
				}
			})

			if (!user) {
				user = await Employee.findByPk(id, {
					where: {
						id
					}
				})


				if (!user) {
					return response.status(404).send({
						message: "User does not  exists"
					});
				}
			}

			bcrypt.compare(
				oldPassword,
				user.dataValues.password,
				(err, resp) => {
					if (resp === false) {
						return response.status(401).send({
							message: 'Wrong Password',
						});
					}
					bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
						const newUpdate = await user.update({
							password: hash
						})
		
						return response.status(200).send({
							message: `Successful!! Your password has been changed`,
							error: false,
		
						});
					})
					
				}); 
		}catch (err) {
			console.log(err)
			return response.status(500).send(err);
		}

	}

}