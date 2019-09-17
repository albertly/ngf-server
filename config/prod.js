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
    }
}