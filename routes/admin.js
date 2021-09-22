import adminController from "../controllers/admin";

let adminCon = new adminController()

const Route = (app) => {

    //endpoint to create admin account
    app.post('/api/v1/admin/create', adminCon.createAccount);
}

export default Route;