// Sinon stubbing
// var db = require('../db');
// var sinon = require('sinon');
//
// sinon.stub(db, "find").yields(null, {id: 1});
//
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

process.env.NODE_ENV = 'CI';

//const should = require('should');
const sinon = require('sinon');
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const authorization = require('../services/authorization');

const Event = require('../models/event');

const eventController = require('../controllers/eventController');
const ExtractJwt = require('passport-jwt').ExtractJwt;

chai.use(chaiHttp);

describe('Event Controller Tests:', () => {
    let res = null;
    let controller = null;
    const event = require('../database/events')[0];

    beforeEach((done) => {
        //Before each test we empty the database
        Event.remove({}, (err) => {
            done();
        });

        res = {
            status: sinon.spy(),
            send: sinon.spy(),
            json: sinon.spy()
        }

        controller = eventController(Event);

    });

    it('should not allow empty parameters on voterAction', async () => {
        const Event = function () {
            this.findOneAndUpdate = (o1, o2) => {
                return {
                    toObject: () => { return new Event(); }
                }
            };
            this.sessions = {
                find: () => { return 'testing'; }
            };
        };

        const req = {
            params: {
                eventId: '1',
                sessionId: null,
                voterId: null
            }
        };

        const e = new Event();
        const controller = eventController(e);
        await controller.voterAction(req, res);

        res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
        res.send.calledWith('One of the mandaory parameters is missing').should.equal(true);

        req.params.sessionId = '1';
        await controller.voterAction(req, res);
        res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
        res.send.calledWith('One of the mandaory parameters is missing').should.equal(true);


        req.params.voterId = '1';
        await controller.voterAction(req, res);
        //res.status.calledWith(200).should.equal(true);
        res.send.calledWith('testing').should.equal(true);

    });

    //ToDo: Problem working with Redis
    describe('/api/events book', () => {

        it('it should GET all the events', (done) => {
            chai.request(server)
                .get('/api/events')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });


        it('it should POST new event when no id', async () => {

            const req = { body: event };

            await controller.saveEvent(req, res);

            res.status.calledWith(201).should.equal(true);
            res.json.args[0][0]._id.should.exist;

        });

        it.only('it should POST Event', (done) => {
            // const stub1 = sinon.stub(passport, 'authenticate').
            //     callsFake((strategy, options, callback) => {
            //         console.log("in stub");
            //         callback(null, {"username": "albertly@comtec.co.il"}, null);
            //         return (req, res, next) => {};
            //     });
            let server = require('../server');
            const stub = sinon.stub(server.pass.passport);
            //    sinon.spy(server.pass.passport, 'authenticate');
            //     sinon.spy(server.server, 'listen');
             //   const requireAuth = passport.authenticate('jwt', { session: false });
             //   sinon.spy(requireAuth);

                
            //returns(() => {user: 'albert'});
            //stub1.authenticate.returns(true);

          //  const stub2 = sinon.stub(ExtractJwt);
           // stub2.requireAdmin.returns(true);
           
           const events = require('../database/events');

            const requester = chai.request(server.server); 
            requester.post('/api/events')
                .send(events[0])                
                .end((err, res) => {
                    //res.should.have.status(200);
                    //res.body.should.be.a('array');
                    const t = server.pass.requireAuth;
                   // server.server.listen.called.should.be.true;
                    //server.pass.passport.authenticate.called.should.be.true;
                    stub.authenticate.called.should.be.true;
                   // requireAuth.called.should.be.true;
                    done();
                });

            
        });
    });

//});
