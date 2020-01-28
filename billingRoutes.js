const passport = require('passport');

const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripe.secretKey);
//const requireLogin = require('../middlewares/requireLogin');

const requireAuth = passport.authenticate('jwt', { session: false });
const Order = require('./models/order');
const Event = require('./models/event');
const User = require('./models/user');

const generatePdf = require('./utils/generatePdf');

module.exports = app => {
  app.get('/api/invoice/pdf/:id', async (req, res) => {
    let orderId;
    let invoiceDate;
    try {
      const user = await User.findOne({ _id: req.params.id }).populate({
        path: 'orders',
        populate: { path: 'eventId' }
      });
      console.log(user);
      orderId = user.id;
      invoiceDate = user.orders[0].purchaseDate;
    }
    catch (err) {
      return res.status(500).send(err);
    }

    const docDefinition = {
      content: [
        {
          text: 'Receipt',
          style: 'header'
        },
        {
          columns: [
            {
              width: 80,
              text: 'Ng-Event'
            },
            {
              width: '*',
              text: `Invoice Date:  ${invoiceDate} \n
                     Invoice #:  ${orderId}`
            }
          ]
        },
        {text: 'A simple table with nested elements', style: 'subheader'},
        'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
        {
          style: 'tableExample',
          table: {
            body: [
              ['Column 1', 'Column 2', 'Column 3'],
              [
                {
                  stack: [
                    'Let\'s try an unordered list',
                    {
                      ul: [
                        'item 1',
                        'item 2'
                      ]
                    }
                  ]
                },
                [
                  'or a nested table',
                  {
                    table: {
                      body: [
                        ['Col1', 'Col2', 'Col3'],
                        ['1', '2', '3'],
                        ['1', '2', '3']
                      ]
                    },
                  }
                ],
                {text: [
                    'Inlines can be ',
                    {text: 'styled\n', italics: true},
                    {text: 'easily as everywhere else', fontSize: 10}]
                }
              ]
            ]
          }
        },
        

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'right'
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        }
      }
    };

    generatePdf(docDefinition, (response) => {
      res.contentType('application/pdf');
      res.setHeader('Content-disposition', `attachment; filename=${orderId}.pdf`)

      res.send(response); // sends a base64 encoded string to client
    });
  });

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