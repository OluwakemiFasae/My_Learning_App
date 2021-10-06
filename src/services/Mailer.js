//const sendgrid = require('@sendgrid/mail')
import sendgrid, { mail } from 'sendgrid';
const helper = mail;

class Mailer extends helper.Mail {
    constructor({ subject, recipients }, content){
        super();

        this.sgApi = sendgrid(process.env.SENDGRID_API_KEY);
        this.from_email = new helper.Email('kemi.fasae@stemres.net');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);
        
        

        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
        
       
    }

    formatAddresses(recipients){
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

        this.recipients.forEach(recipient => {
            personalize.addTo(recipient);
        });
        this.addPersonalization(personalize);
    }

    async send() {
        
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