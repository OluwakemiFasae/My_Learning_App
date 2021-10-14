import Mailer from '../services/Mailer'

const sendEmail = async (employees, template) => {

    for(let employee of employees) {
        
        let recipients = employee.email

        //send email here
        const newMail = {
            subject: 'Login to MyLearning App',
            recipients: recipients.split(',')
                .map(email => ({
                    email: email.trim()
                })),
            firstname: employee.firstname,
            username: employee.email,
            password: employee.unhashedpassword,
            
            loginUrl: ''
        }

        const mailer = new Mailer(newMail, template(newMail));
        try {
            await mailer.send();
        } catch(err) {
            return responseHandler(
                request,
                response,
                422,
                null,
                err)
        }
    }
    
    
}
    
 
 
 export { sendEmail }



    