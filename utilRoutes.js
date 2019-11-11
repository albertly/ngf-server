const keys = require('./config/keys');

const sendMail = require('./utils/sendMail.util');

module.exports = app => {
    app.post('/api/sendmail', async (req, res) => {

        const to = req.body.to;
        const from = keys.sendgrid.sendgrid_from;
        const subject = req.body.subject;
        const text = req.body.text;
        const html = req.body.html;

        sendMail(to, from, subject, text, html);
        
        res.status(200).json("");
    })
}