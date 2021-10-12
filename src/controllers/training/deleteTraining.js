const Training = require('../../models').Training

import { responseHandler } from '../../helpers/responseHandler';
 
const deleteTraining = async(request, response) => {
    const id = parseInt(request.params.id)

    const training = await Training.findByPk(id, {
        attributes: {
            exclude: ['createdAt']
        }
    })
    if (training) {

    
        await training.destroy().catch(error => { 
            return error 
        });
        return responseHandler(
            request, 
            response, 
            200, 
            {
                status: 'Successful',
                message: `${training.topic} has been deleted`,
            }
        )
    }
    else {
        return responseHandler(
            request,
            response,
            404,
            null,
            'This training does not exist'
          )
    }

}

export default deleteTraining