module.exports = {
    secret: 'albert',
    mongo: 'mongodb+srv://dbUser:taligent31@cluster0-3jbil.mongodb.net/auth',
    //mongo: 'mongodb://localhost:27017/auth',
    googleAuth: {
        clientID: '100046837471-ghjok7nacijtqdis9rbrnc2mua2n3rh4.apps.googleusercontent.com',
        clientSecret: 'SuOd9J8AgK8BFvzP-7D0LtI7',
    },
    stripe: {
        publishableKey: 'pk_test_j3acsib29tsMFPqakQN0pc8T00gvFoiYIH',
        secretKey: 'sk_test_NzPBl6gocsXMke9vJ1txPENR00huPyCdYL'
    },
    sendgrid: {
        sendgrid_api_key: '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',
        sendgrid_from: 'albert.lyubarsky@gmail.com'
    }
}