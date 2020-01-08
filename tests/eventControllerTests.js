const should = require('should');
const sinon = require('sinon');
const eventController = require('../controllers/eventController');

describe('Event Controller Tests:', ()=> {
    it('should not allow empty parameters on voterAction', async () => {
        const Event = function ()  {
            this.findOneAndUpdate = (o1, o2) => { return  {
                                                    toObject: () =>  { return new Event();}
                                                }};
            this.sessions = {
                find: () => {return 'testing';}
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

        res.status.calledWith(400).should.equalOneOf(true, `Bad Status ${res.status.args[0][0]}`);
        res.send.calledWith('One of the mandaory parameters is missing').should.equal(true);

        req.params.sessionId = '1';
        await controller.voterAction(req, res);
        res.status.calledWith(400).should.equalOneOf(true, `Bad Status ${res.status.args[0][0]}`);
        res.send.calledWith('One of the mandaory parameters is missing').should.equal(true);

        
        req.params.voterId = '1';
        await controller.voterAction(req, res);
        //res.status.calledWith(200).should.equal(true);
        res.send.calledWith('testing').should.equal(true);

    });
});
