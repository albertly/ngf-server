const Event = require('../models/event');


exports.getEvents = async function (req, res) {
  let events = null;
  try {
    events = await Event.find({}).cache({ key: '0' });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
    // return next(err);
  }

  res.status(200).json(events);
}


exports.deleteEvent = function (req, res) {
  Event.findByIdAndRemove(req.params.eventId, function (err, result) {
    if (err) { return next(err); };
    if (!result) { return res.status(404).send('') };
    res.status(200).send(result);
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

  Event.aggregate([
    {
      "$unwind": "$sessions"
    },
    {
      $match: {
        "sessions.name": {
          "$regex": term,
          "$options": "i"
        }
      }
    },

    {
      $project: {
        _id: "$_id",
        "sessions": 1
      }
    }
  ])
    .then(result => {
      results = result.map(item => {
        return {
          eventId: item._id.toString(),
          ...item.sessions
        }
      })
      res.send(results);
    })
    .catch(err => {
      console.log('err', err);
      res.status(500).send(err);
    });

}

exports.voterAction = function (req, res) {
  var voterId = req.params.voterId,
    sessionId = req.params.sessionId,
    eventId = req.params.eventId;
  let session = {};

  const action = req.method === 'DELETE' ? '$pull' : '$push';

  const options = { new: true };
  Event.findOneAndUpdate({ "_id": eventId, "sessions.id": sessionId },
    { [action]: { "sessions.$.voters": voterId } }, options)
    .then(result => {
      const event = result.toObject();
      session = event.sessions.find(session => session.id === +sessionId)
      res.send(session);
    })
    .catch(err => {
      console.log('err', err);
      res.status(500).send(err);
    });
}


exports.saveEvent = function (req, res) {
  const eventReq = req.body;

  if (eventReq._id) {
    // To do: what to do when found
    Event.findById(eventReq._id, function (err, doc) {
      if (err) { return next(err); }
      // res.status(409).json(result);
      doc.sessions = eventReq.sessions;
      // Event.findByIdAndUpdate(eventReq._id, )

      doc.save(function (err, result) {
        if (err) { return next(err); }
        res.status(200).json(result);
      });

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


