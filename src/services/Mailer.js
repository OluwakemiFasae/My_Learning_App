//const sendgrid = require('@sendgrid/mail')
import sendgrid, { mail } from 'sendgrid';
const helper = mail;

class Mailer extends helper.Mail {
    constructor({ subject, recipients, body}){
        super();

        this.sgApi = sendgrid(process.env.SENDGRID_API_KEY);
        this.from_email = new helper.Email('kemi.fasae@stemres.net');
        this.subject = subject;
        this.body = new helper.Content('text/html', body);
        this.recipients = this.formatAddresses(recipients);
        
        

        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
        
       
    }

    formatAddresses(recipients){
        // console.log('This is before formatting address')
        // console.log(recipients)
        // console.log('This is the type of')
        // console.log(typeof(recipients))

        return recipients.map(( { email } ) => {
            return new helper.Email(email);
        })
    }

    addClickTracking() {
        const trackingsettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingsettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingsettings);
        this.addRecipients();
    }

    addRecipients(){
        const personalize = new helper.Personalization();
        
        // console.log('This is inside the addRecipients function')
        // console.log(this.recipients)

        this.recipients.forEach(recipient => {
            console.log(recipient)
            personalize.addTo(recipient);
        });
        this.addPersonalization(personalize);
    }

    async send() {
        console.log(this.toJSON())
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON()
        });


        try {
            const response = await this.sgApi.API(request);
            return response;
        }catch (error) {
            console.error(error);

            if(error.response){
                console.error(error.response.body)
            }
        }
        
    }
}

export default Mailer;