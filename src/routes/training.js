import createNewTraining from '../controllers/training/registerTraining'
import updateTraining from '../controllers/training/updateTraining'
import authorize from '../middlewares/authorize'

const Route = app => {
    //create new training 
    app.post(
        '/api/v1/training/register', authorize, createNewTraining)

    // Update Training
    app.put('/api/v1/training/:id', authorize, updateTraining)
}

export default Route
