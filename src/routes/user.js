import UserController from "../controllers/users";
import authorize from "../middlewares/authorize";

const UserCon = new UserController()

const Route = (app) => {

    //endpoint to create company account
    app.post('/api/v1/user/login', UserCon.login);

    app.get('/api/v1/company/resetemail/', UserCon.resetEmail)

    app.post('/api/v1/company/resetpwd/:token', UserCon.resetPassword)

    //endpoint to get the current user logged in
    app.get('/currentuser', authorize, UserCon.getCurrentUser)

}

export default Route;