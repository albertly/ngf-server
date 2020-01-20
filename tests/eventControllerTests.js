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

const Event = require('../models/event');
const authorization = require('../services/authorization');


chai.use(chaiHttp);

describe('Event Controller Tests:', () => {

    const events = require('../database/events')[0];

    // beforeEach((done) => {
    //     //Before each test we empty the database
    //     // Event.remove({}, (err) => {
    //     //     done();
    //     // });

    //     res = {
    //         status: sinon.spy(),
    //         send: sinon.spy(),
    //         json: sinon.spy()
    //     }

    //     passSpy = sinon.spy(passport, 'authenticate');
    //     controller = eventController(Event);

    // });


    //ToDo: Problem working with Redis
    describe('/api/events book', () => {

        // it('it should GET all the events', (done) => {
        //     chai.request(server)
        //         .get('/api/events')
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.be.a('array');
        //             res.body.length.should.be.eql(0);
        //             done();
        //         });
        // });

        let stubAuth = null;
        let server = null;

        before(() => {
            stubAuth = sinon.stub(passport, 'authenticate')
            .returns((req, res,done) => {
                done(null, {user:'albert'});
            });

            sinon.stub(authorization, 'requireAdmin').callsFake((req, res, done) => {
               return done();
            });

            server = require('../server');
            
        })

        after(() => {
            server.close();
        })
        
        it('it should POST Event', (done) => {
           
            const requester = chai.request(server); 
            requester.post('/api/events')
                .send(events[0])                
                .end((err, res) => {

                    stubAuth.called.should.be.true;
                   
                    done();
                });

            
        });
    });

});
