import adminController from "../controllers/admin";

const Route = (app) => {

    //endpoint to create admin account
    app.post('/api/v1/admin/create', adminController.createAccount);
}

export default Route;