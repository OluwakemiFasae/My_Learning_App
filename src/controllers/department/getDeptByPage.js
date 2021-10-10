const Department = require('../../models').Department;

import { responseHandler } from '../../helpers/responseHandler';

const getDeptByPage = async (request, response) => {

    const companyId = parseInt(request.user.id)

    let limit = 25;   // number of records per page
    let offset = 0;

    const allData = await Department.findAndCountAll({
        where: {
            companyId,
        },
    })

    if (allData.length === 0) {
        return responseHandler(
            request,
            response,
            404,
            null,
            `No department has been added for company ${companyId}`
        )
    } else {
        let page = request.params.age //to get page number

        let pages = Math.ceil(allData.count / limit);
        offset = limit * (page - 1);

        const pagedData = await Department.findAll({
            limit: limit,
            offset: offset,
            where: {
                companyId,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        }).catch(error => {
            return error
        });

        return responseHandler(
            request,
            response,
            200,
            {
                message: 'Successful!!',
                data: pagedData,
                pages
            }
        )

    }
}

export default getDeptByPage