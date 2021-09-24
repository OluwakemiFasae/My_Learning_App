import passport from "passport"
import adminController from "../controllers/admin";
import companyController from "../controllers/company";


let adminCon = new adminController()
let compCon = new companyController()

function isLoggedIn(req,res,next){
    console.log(req.user)
    if(req.user){
        next()
    }else{
        res.sendStatus(401)
    }//? next() : res.sendStatus(401)
}

const Route = (app) => {
    //endpoint to create company account
    app.post('/api/v1/admin/create', compCon.createAccount);

    //endpoint to update company details
    app.put('/api/v1/company/config/:companyId', compCon.UpdateAccount);


    //endpoint to create admin account with google auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/failed',
    }), (req, res) => {
        res.redirect('/success')
    });

    app.get('/success', isLoggedIn, (req, res) => {
        res.send({
            "message": "Login Successful",
            "data": req.user
        })
    })

    app.get('/failed', (req,res) => {
        res.send ('Failed!!!!')
    })
    
}

export default Route;