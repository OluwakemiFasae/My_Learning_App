import { responseHandler } from "./responseHandler"

const isAdmin = (request, response, next) => {
    if (request.user.admin !== true) {
        return responseHandler(request, response, 401, null,
            'You have to be an admin to perform this action.'
        )
    }
    next()
}

export default isAdmin