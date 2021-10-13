import authorize from '../middlewares/authorize'
import isAdmin from '../helpers/isAdmin'

import AddNew from '../controllers/department/addNew'
import GetOneDept from '../controllers/department/getOneDept'
import GetAllDept from '../controllers/department/getAllDept'
import GetDeptByPage from '../controllers/department/getDeptByPage'
import UpdateDept from '../controllers/department/updateDept'
import DeleteDept from '../controllers/department/deleteDept'


const Route = (app) => {

    //endpoint to create department during site config
    app.post('/api/v1/company/config/department', authorize, isAdmin, AddNew)

    //endpoint to get one department 
    app.get('/api/v1/company/departments/:deptId', authorize, isAdmin, GetOneDept)

    //endpoint to get all departments 
    app.get('/api/v1/company/departments', authorize, isAdmin, GetAllDept)

    //endpoint to get department by pages
    app.get('/api/v1/company/departments/:page', authorize, isAdmin, GetDeptByPage)
    
    //endpoint to get update department information 
    app.put('/api/v1/company/departments/:deptId', authorize, isAdmin, UpdateDept)

    //endpoint to delete department
    app.delete('/api/v1/company/departments/:deptId', authorize, isAdmin, DeleteDept)
}

export default Route;