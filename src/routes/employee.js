import authorize from "../middlewares/authorize";
import isAdmin from "../helpers/isAdmin";


import createNew from '../controllers/employee/createNew'
import getOneEmp from '../controllers/employee/getOneEmp'
import getAllEmp from '../controllers/employee/getAllEmp'
import updateEmployee from '../controllers/employee/updateEmployee'
import resetEmpPass from '../controllers/employee/resetEmpPass'
import deleteEmp from '../controllers/employee/deleteEmp'

const Route = (app) => {

    //endpoint to create new employee account
    app.post('/api/v1/company/employees',authorize, isAdmin, createNew);

    //endpoint to get one employee
    app.get('/api/v1/company/employees/:empId', authorize, isAdmin, getOneEmp)

    //endpoint to get all employees
    app.get('/api/v1/company/employees', authorize, isAdmin, getAllEmp)

    //endpoint to update employees
    app.put('/api/v1/company/employees/:empId', authorize, isAdmin, updateEmployee)

    //endpoint to reset password for employee
    app.put('/api/v1/company/employees/:empId/resetpwd', authorize, isAdmin, resetEmpPass)

    //endpoint to update employees
    app.delete('/api/v1/company/employees/:empId', authorize, isAdmin, deleteEmp)


}

export default Route;