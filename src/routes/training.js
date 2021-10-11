import TrainingController from '../controllers/training'
import authorize from '../middlewares/authorize'

const Training = new TrainingController()

const Route = app => {
  //endpoint to create new employee account
  app.post(
    '/api/v1/company/training/register',
    authorize,
    Training.createNewTraining
  )
}

export default Route
