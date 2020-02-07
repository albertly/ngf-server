process.env.NODE_ENV = 'CI';

//const should = require('should');
const sinon = require('sinon');
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const Order = require('../models/order');

const billingController = require('../controllers/eventController');