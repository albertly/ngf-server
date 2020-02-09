process.env.NODE_ENV = 'DEV';

//const should = require('should');
const sinon = require('sinon');
const mongoose = require("mongoose");
const config = require('../config/keys');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../models/user');
const Order = require('../models/order');

const billingController = require('../controllers/billingController')();

//https://www.npmjs.com/package/pdf-parse
describe('Billing Controller Tests:', () => {

    it.only('generateInvoice should make PDF', async () => {
        mongoose.connect(config.mongo);

        const req = {
            params: {
                id: '5ddfad88733705f1beafe999'
                //id: '5ded532b127cec2bec7b0e6c'
            }
        };

        //let resData;
        const res = {
            contentType: sinon.spy(),
            setHeader: sinon.spy(),
            send: sinon.spy(),
        };

        await billingController.generateInvoice(req, res);
        
        res.contentType.alwaysCalledWith('application/pdf');
        res.send.args[0][0].byteLength.should.be.gt(1000);

        return;
        const order = await Order.findOne({ _id: '5ded532b127cec2bec7b0e6c' })
            .populate({
                path: 'eventId'
            })
            .populate({
                path: 'userId'
            });

        console.log(order.toObject());

        // const user = await User.findOne({ _id: '5ded528f127cec2bec7b0e6b' })
        //     .populate({
        //         path: 'orders',
        //         match: { _id: '5ded532b127cec2bec7b0e6c' },
        //         populate: { path: 'eventId' }
        //     });


        // console.log(user.toObject());

        return;
    });

});