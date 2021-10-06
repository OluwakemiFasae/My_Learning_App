
export default (message) => {
    return `
            <html> 
                <body>
                    <div style ="text-align: center;">
                        <h3> Reset your password </h3>
                        
                        <p> Click <a href = "${process.env.REDIRECT_DOMAIN}${message.body}">here</a> to reset your password.</p>

                </body>
            </html>
        `; 
        //back tick is used to handle multiline strings in JavaScript
}

//export default temp;