import authorize from "../middlewares/authorize"

import resetEmail from "../controllers/user/resetEmail"
import resetPassword from "../controllers/user/resetPassword"
import login from "../controllers/user/login"
import changePassword from "../controllers/user/changePassword"
import getCurrentUser from "../controllers/user/getCurrentUser"

const Route = (app) => {

    //endpoint for users( employee or admin) to log in
    app.post('/api/v1/user/login', login);

    //endpoint to send email to user with reset password link
    app.get('/api/v1/user/resetemail/', resetEmail)

    //endpoint to reset password before login
    app.put('/api/v1/user/resetpwd/:token', resetPassword)

    //endpoint to change password when logged in
    app.put('/api/v1/user/resetpwd/', authorize, changePassword)

    //endpoint to get the current user logged in
    app.get('/currentuser', authorize, getCurrentUser)

}

export default Route;