import passport from "passport"
import adminController from "../controllers/admin";


let adminCon = new adminController()

const Route = (app) => {
    //endpoint to create admin account
    app.post('/api/v1/admin/create', adminCon.createAccount);

    //endpoint to create admin account with google auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))

    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.send( 'Logged In')
    })

    app.get('/redirect', () => {
        return ('Redirected address')
    })
}

export default Route;