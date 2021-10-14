import createNewTraining from '../controllers/training/registerTraining'
import updateTraining from '../controllers/training/updateTraining'
import authorize from '../middlewares/authorize'
import isAdmin from '../helpers/isAdmin'
import deleteTraining from '../controllers/training/deleteTraining'
import getAllTraining from '../controllers/training/getAllTraining'
import getOneTraining from '../controllers/training/getOneTraining'

const Route = app => {
    //create new training 
    app.post(
        '/api/v1/training/register', authorize, isAdmin, createNewTraining)

    // Update Training
    app.put('/api/v1/training/:id', authorize, isAdmin, updateTraining)

    //delete training
    app.delete('/api/v1/training/:id', authorize, isAdmin, deleteTraining)

    app.get('/api/v1/trainings', authorize, getAllTraining)
    // Get Single Training
    app.get('/api/v1/training/:id', authorize, isAdmin, getOneTraining)
}

export default Route
