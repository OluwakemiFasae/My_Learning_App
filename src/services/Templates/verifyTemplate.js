const temp = (message) => {
    return `
            <html> 
                <body>
                    <div style ="text-align: center;">
                        <h3> Account Verification </h3>
                        
                        <p> ${message.body} </p>

                </body>
            </html>
        `; 
        //back tick is used to handle multiline strings in JavaScript
}

export default temp;