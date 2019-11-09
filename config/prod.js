module.exports = {
    secret: process.env.SECRET,
    mongo: process.env.MONGO, 
    //mongo: 'mongodb://localhost:27017/auth',
    googleAuth: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    },
    stripe: {
        publishableKey: process.env.PUBLISHABLE_KEY,
        secretKey: process.env.SECRET_KEY
    },
    sendgrid: {
        sendgrid_api_key: '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'
    }
}