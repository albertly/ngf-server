var events = require('../database/events'),
  getNextId = require('./getNextId'),
  url = require('url');

const Event = require('../models/event');  

var nextId = getNextId(events);

exports.getEvents = function(req, res) {

  // test
    Event.find({}, function (err, allEvents) {
      if (err) { return next(err); }
  
      console.log('allEvents', allEvents);
      res.status(200).json(allEvents);
  
    });
  // end test
  
}

exports.getEvent = function(req, res) {
  Event.findById(req.params.eventId, function (err, result) {
    if (err) { return next(err); }
    console.log('res', result);
    res.status(200).json(result);
  });
  //var event = events.find(event => event.id === +req.params.eventId);
  //res.send(event);
}

exports.searchSessions = function(req, res) {
	var term = req.query.search.toLowerCase();
  var results = [];
  events.forEach(event => {
    var matchingSessions = event.sessions.filter(session => session.name.toLowerCase().indexOf(term) > -1)
    matchingSessions = matchingSessions.map(session => {
      session.eventId = event.id;
      return session;
    })
    results = results.concat(matchingSessions);
  })
  res.send(results);
}

exports.deleteVoter = function(req, res) {
  var voterId = req.params.voterId,
      sessionId = parseInt(req.params.sessionId),
      eventId = parseInt(req.params.eventId);

  var session = events.find(event => event.id === eventId)
    .sessions.find(session => session.id === sessionId)
    
  session.voters = session.voters.filter(voter => voter !== voterId);
  res.send(session);
}

exports.addVoter = function(req, res) {
  var voterId = req.params.voterId,
      sessionId = parseInt(req.params.sessionId),
      eventId = parseInt(req.params.eventId);

  var event = events.find(event => event.id === eventId)
  var session = event.sessions.find(session => session.id === sessionId)
    
  session.voters.push(voterId);
  res.send(session);
}

exports.saveEvent = function(req, res) {
  var event = req.body;
  
  if (event.id) {
    var index = events.findIndex(e => e.id === event.id)
    events[index] = event
  } else {
    event.id = nextId;
    nextId++;
    event.sessions = [];
    events.push(event);
  }
  res.send(event);
  res.end(); 
}


