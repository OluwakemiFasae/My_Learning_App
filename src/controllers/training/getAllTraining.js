import { Training } from '../../models';


const getAllTraining = async (request, response) => {
    const companyId = parseInt(request.user.id)

    const trainings = await Training.findAll({
            where: {
                companyId
            },
            
        attributes: {
            exclude: ['password','createdAt', 'updatedAt']
        },
    }).catch(error => { 
        return error 
    });

    if (trainings.length === 0) {
        
        return responseHandler(
            request,
            response,
            200,
            {
                message: 'No trainings have been added for your company'
            },    
          )
    }
    return responseHandler(
        request, 
        response, 
        200, 
        {
            message: 'Successful',
            data: trainings,
        }
    )
}

export default getAllTraining