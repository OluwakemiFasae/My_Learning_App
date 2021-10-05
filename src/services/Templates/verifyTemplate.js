
export default (message) => {
    return `
            <html> 
                <body>
                    <div style ="text-align: center;">
                        <h3> Account Verification </h3>
                        
                        <p> Please verify your account </p>
                        <p> Click <a href = "${process.env.redirectDomain}/${message.body}">here</a> to confirm your email.</p>

                </body>
            </html>
        `; 
        //back tick is used to handle multiline strings in JavaScript
}

//export default temp;