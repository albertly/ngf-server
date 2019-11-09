const keys = require('./config/keys');

module.exports = app => {
    app.post('/api/sendmail', async (req, res) => {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(keys.sendgrid.sendgrid_api_key);
        const msg = {
            to: 'albert.lyubarsky@gmail.com',
            from: 'albert.lyubarsky@gmail.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        sgMail.send(msg);
        res.status(200).json("");
    })
}