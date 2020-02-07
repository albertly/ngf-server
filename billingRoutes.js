const passport = require('passport');

const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripe.secretKey);
//const requireLogin = require('../middlewares/requireLogin');

const requireAuth = passport.authenticate('jwt', { session: false });
const Order = require('./models/order');
const Event = require('./models/event');
const User = require('./models/user');

const bilingController = require('./controllers/billingController')();

module.exports = app => {
  
  app.get('/api/invoice/pdf/:id', bilingController.generateInvoice);


  app.post('/api/stripe', requireAuth, async (req, res) => {

    console.log(req.body);
    let event = {};
    try {
      event = await Event.findById(req.body.eventId);
    }
    catch (err) {
      return res.status(500).send(err);
    }

    let charge = {};
    try {
      charge = await stripe.charges.create({
        amount: event.price * 100,
        currency: 'usd',
        description: event.name,
        source: req.body.token.id
      });
    }
    catch (err) {
      return res.status(500).send(err);
    }

    const order = new Order({
      userId: req.user._id,
      eventId: req.body.eventId,
      purchaseDate: new Date(),
    });

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(500).send("User not found. Something wrong");
    }

    user.orders.push(order);

    let newOrder = {};
    try {
      newOrder = await order.save();
      await user.save();
    }
    catch (err) {
      return res.status(500).send(err);
    }

    res.status(201).send("Paid");

  });

};