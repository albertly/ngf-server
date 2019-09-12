const keys = require('./config');
const stripe = require('stripe')(keys.stripe.secretKey);
//const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', async (req, res) => {
    
    console.log(req.body);
    const charge = await stripe.charges.create({
      amount: 5000000,
       currency: 'usd',
       description: '$5 for 5 credits',
       source: req.body.token.id
   });

    // req.user.credits += 5;
    // const user = await req.user.save();

    // res.send(user);
  });
};