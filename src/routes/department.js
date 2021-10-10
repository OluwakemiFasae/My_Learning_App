import authorize from '../middlewares/authorize' 

import AddNew from '../controllers/department/addNew'
import GetOneDept from '../controllers/department/getOneDept'
import GetAllDept from '../controllers/department/getAllDept'
import GetDeptByPage from '../controllers/department/getDeptByPage'
import UpdateDept from '../controllers/department/updateDept'


const Route = (app) => {

    //endpoint to create department during site config
    app.post('/api/v1/company/config/department', authorize, AddNew)

    //endpoint to get one department 
    app.get('/api/v1/company/departments/:deptId', authorize, GetOneDept)

    //endpoint to get all departments 
    app.get('/api/v1/company/departments', authorize, GetAllDept)

    //endpoint to get department by pages
    app.get('/api/v1/company/departments/:page', authorize, GetDeptByPage)
    
    //endpoint to get update department information 
    app.put('/api/v1/company/departments/:deptId', authorize, UpdateDept)
}

export default Route;