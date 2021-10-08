import passport from "passport"
import userController from "../controllers/users";
import companyController from "../controllers/company";

import authorize from '../middlewares/authorize' 


let userCon = new userController()
let compCon = new companyController()


const Route = (app) => {
    //endpoint to create company account
    app.post('/api/v1/admin/create', compCon.createAccount);

    //endpoint to verify email address
    app.get('/api/v1/company/verify/:token', compCon.verify);
    
    //endpoint to update company details
    app.put('/api/v1/company/config/', authorize, compCon.UpdateAccount);

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

    //endpoint to create department during site config
    app.post('/api/v1/company/config/department', authorize, compCon.AddDept)

    //endpoint to get one department 
    app.get('/api/v1/company/departments/:deptId', authorize, compCon.getDept)

    //endpoint to get all departments 
    app.get('/api/v1/company/departments', authorize, compCon.getAllDept)

    //endpoint to get department by pages
    app.get('/api/v1/company/departments/:page', authorize, compCon.getDeptByPage)
    
    //endpoint to get update department information 
    app.put('/api/v1/company/departments/:deptId', authorize, compCon.updateDept)
}

export default Route;