function eventController(Event) {

  const getEvents = async (req, res) => {
    let events = null;
    try {
      events = await Event.find({}).cache({ key: '0' });
    }
    catch (err
    ) {
      return next(err);
    }

    res.status(200).json(events);
  }


  const deleteEvent = (req, res) => {
    Event.findByIdAndRemove(req.params.eventId, function (err, result) {
      if (err) { return next(err); };
      if (!result) { return res.status(404).send('') };
      res.status(200).send(result);
    });
  }

  const getEvent = (req, res) => {
    Event.findById(req.params.eventId, function (err, result) {
      if (err) {
        // ToDo: Log error
        return res.status(500).send("Error 500");
      }
      res.status(200).json(result);
    });
  }

  const searchSessions = (req, res) => {
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

  const voterAction = async (req, res) => {
    const voterId = req.params.voterId,
      sessionId = req.params.sessionId,
      eventId = req.params.eventId;
    let session = {};

    if (!voterId || !sessionId || !eventId) {
      res.status(400);
      return res.send('One of the mandaory parameters is missing');
    }

    const action = req.method === 'DELETE' ? '$pull' : '$push';

    const options = { new: true };

    try {
      const result = await Event.findOneAndUpdate({ "_id": eventId, "sessions.id": sessionId },
        { [action]: { "sessions.$.voters": voterId } }, options)


      const event = result.toObject();
      session = event.sessions.find(session => session.id === +sessionId);
      return res.send(session);
    }
    catch (err) {
      //ToDo: add logging
      console.log('err', err);
      return res.status(500).send(err);
    }

  }


  const saveEvent = (req, res) => {
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

  return { getEvents, deleteEvent, getEvent, searchSessions, voterAction, saveEvent };
}

module.exports = eventController;
