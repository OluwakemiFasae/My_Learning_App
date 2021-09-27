import passport from "passport"
import adminController from "../controllers/admin";
import companyController from "../controllers/company";

import authorize from '../middlewares/authorize' 


let adminCon = new adminController()
let compCon = new companyController()


const Route = (app) => {
    //endpoint to create company account
    app.post('/api/v1/admin/create', compCon.createAccount);

    
    //endpoint to update company details
    app.put('/api/v1/company/config/:companyId', authorize, compCon.UpdateAccount);


    //endpoint to create admin account with google auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))

    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.send({
            "message": "Login Successful",
            "data": req.user
        })
    });

    
}

export default Route;