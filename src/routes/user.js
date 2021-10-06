import UserController from "../controllers/users";
import authorize from "../middlewares/authorize";

const UserCon = new UserController()

const Route = (app) => {

    //endpoint to create company account
    app.post('/api/v1/user/login', UserCon.login);

    app.get('/api/v1/user/resetemail/', UserCon.resetEmail)

    app.put('/api/v1/user/resetpwd/:token', UserCon.resetPassword)

    app.put('/api/v1/user/resetpwd/', authorize, UserCon.changePassword)

    //endpoint to get the current user logged in
    app.get('/currentuser', authorize, UserCon.getCurrentUser)

}

export default Route;