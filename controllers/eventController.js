function eventController(Event) {

  const getEvents = async (req, res) => {
    let events = null;
    try {
      events = await Event.find({}).cache({ key: '0' });
    }
    catch (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }

    res.status(200).json(events);
  }


  const deleteEvent = async (req, res) => {

    try {
      const result = await Event.findByIdAndRemove(req.params.eventId);
      if (!result) {
        res.status(404)
        return res.send('Event Id not found');
      };
      res.status(200).send(result);
    }
    catch (e) {
      res.status(500);
      return res.send('Error deleting event ' + e);
    }
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


  const saveEvent = async (req, res) => {

    const eventReq = req.body;

    if (eventReq._id) {

      try {
        const doc = await Event.findById(eventReq._id);

        if (!doc) {
          res.status(404);
          return res.send("Event Id not founc");
        }

        doc.sessions = eventReq.sessions;

        doc.save(function (err, result) {
          if (err) { return next(err); }
          res.status(200);
          return res.json(result);
        });
      }
      catch (e) {
        res.status(500);
        return res.json("Error finding event: " + e);
      }

    } else {
      const event = new Event({
        ...eventReq, sessions: []
      });
      try {
        const result = await event.save();
        // Repond to request indicating the user was created
        res.status(201);
        return res.json(result);
      }
      catch (e) {
        res.status(500);
        return res.json("Error saving event: " + e);
      }

    }
  }

  return { getEvents, deleteEvent, getEvent, searchSessions, voterAction, saveEvent };
}

module.exports = eventController;
