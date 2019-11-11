
const keys = require('../config/keys');

module.exports = function sendMail( to, from, subject, text, html ) {

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(keys.sendgrid.sendgrid_api_key);
    const msg = {
        to,
        from,
        subject,
        text,
        html,
    };
   return sgMail.send(msg);
}