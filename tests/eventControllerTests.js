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

const Event = require('../models/event');
const server = require('../server');
const eventController = require('../controllers/eventController');


chai.use(chaiHttp);

describe('Event Controller Tests:', () => {
    beforeEach((done) => { //Before each test we empty the database
         Event.remove({}, (err) => { 
            done();           
         });        
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

        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
            json: sinon.spy()
        }

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

        it.skip('it should GET all the events another time', (done) => {
               
            const requester = chai.request(server); 
            requester.get('/api/events')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

});
