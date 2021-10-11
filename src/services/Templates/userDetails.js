const userDetailTemplate = (message) => {
    return `
            <html> 
                <body>
                    <div style ="text-align: center;">
                        <h3> Login to your new account </h3>
                        <p> Hello ${message.firstname}, you have a new account opened for you by your organisation on MyLearning App. </p>
                        <p> Please log in with the following details to access your account. </p
                        <p> Email: ${message.username}
                        <p> Password: ${message.password}
                        
                        <p> You will be prompted to change your password immediately you log in. Please reach out to your company's administrator should you encounter any problem. </p>
                        
                        <p> Click <a href = "${process.env.REDIRECT_DOMAIN}${message.loginUrl}">here</a> to login to your account.</p>

                </body>
            </html>
        `; 
        
}

export { userDetailTemplate }