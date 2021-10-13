import passport from "passport"

import authorize from '../middlewares/authorize'
import isAdmin from "../helpers/isAdmin"

import createAccount from '../controllers/company/createAccount'
import verify from '../controllers/company/verifyEmail'
import updateAccount from '../controllers/company/updateAccount'



const Route = (app) => {
    //endpoint to create company account
    app.post('/api/v1/company/create', createAccount);

    //endpoint to verify email address
    app.get('/api/v1/company/verify/:token', verify);

    //endpoint to update company details
    app.put('/api/v1/company/config/', authorize, isAdmin, updateAccount);

    //endpoint to create admin account with google auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))

    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.send({
            message: "Login Successful",
            data: req.user,
            error: false
        })
    });

}

export default Route;