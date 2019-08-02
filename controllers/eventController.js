var events = require('../database/events');

const Event = require('../models/event');


exports.getEvents = function (req, res) {
  Event.find({}, function (err, allEvents) {
    if (err) { return next(err); }
    res.status(200).json(allEvents);
  });
}

exports.getEvent = function (req, res) {
  Event.findById(req.params.eventId, function (err, result) {
    if (err) { return next(err); }
    res.status(200).json(result);
  });
}

exports.searchSessions = function (req, res) {
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

exports.voterAction = function (req, res) {
  var voterId = req.params.voterId,
    sessionId = req.params.sessionId,
    eventId = req.params.eventId;
  let session = {};

  const action = req.method === 'DELETE' ? '$pull' : '$push';

  const options = { new: true };
  Event.findOneAndUpdate({ "_id": eventId, "sessions.id": sessionId },
    { [action]: { "sessions.$.voters": voterId }}, options)
    .then(result => {
      const event = result.toObject();
      session = event.sessions.find(session => session.id === +sessionId)
      res.send(session);
    })
    .catch(err => console.log('err', err));
}


exports.saveEvent = function (req, res) {
  const eventReq = req.body;

  if (eventReq._id) {
    // To do: what to do when found
    Event.findById(eventReq._id, function (err, result) {
      if (err) { return next(err); }
      res.status(409).json(result);
    });
  } else {
    const event = new Event({
      ...eventReq, sessions: []
    });
    event.save(function (err, result) {
      if (err) { return next(err); }
      // Repond to request indicating the user was created
      res.status(201).json(result);
    });
  }
}


