import EmployeeController from "../controllers/employee";
import authorize from "../middlewares/authorize";

const EmployeeCon = new EmployeeController()

const Route = (app) => {

    //endpoint to create new employee account
    app.post('/api/v1/company/employees',authorize, EmployeeCon.createNew);

    

    //endpoint to get the current user logged in
    //app.get('/currentuser', authorize, UserCon.getCurrentUser)

}

export default Route;