const getCurrentUser = (request, response) => {
    return response.send(request.user);
}

export default getCurrentUser