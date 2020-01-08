const  path = require('path');
const passport = require('passport');

const Event = require('./models/event');
const  events = require('./controllers/eventController')(Event);

const  users = require('./controllers/userController');
const authorization = require('./services/authorization');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
require('./services/passport');


module.exports = function(app) {
  //test 
  app.post('/api/login', requireSignin, users.authenticate);
  app.post('/api/signup', users.signup);

  app.delete('/api/users/:id', requireAuth, users.deleteUser)
  app.put('/api/users/:id', requireAuth, users.updateUser);
  app.put('/api/users/ex/:id', requireAuth, authorization.requireAdmin, users.updateUserEx);
  app.get('/api/verify/:id', users.verify);
  app.get('/api/users/:id', users.getUser);

  app.get('/api/events', events.getEvents);
  app.delete('/api/events/:eventId',  requireAuth, authorization.requireAdmin, events.deleteEvent);
  app.get('/api/events/:eventId', events.getEvent);
  app.post('/api/events', requireAuth, authorization.requireAdmin, events.saveEvent);
  app.get('/api/sessions/search', events.searchSessions);
  app.delete('/api/events/:eventId/sessions/:sessionId/voters/:voterId', requireAuth, events.voterAction);
  app.post('/api/events/:eventId/sessions/:sessionId/voters/:voterId', requireAuth, events.voterAction);
  
  app.post('/api/logout', function(req, res) {
    req.logout();
    res.end();
  });
  
  app.post('/api/google',passport.authenticate('google-token', {session: false}), users.authGoogleUser);

  app.get('/app/*', function(req, res) {
    res.sendStatus(404);
  });
  
  app.get('/node_modules/*', function(req, res) {
    res.sendStatus(404);
  });

  // Handles any requests that don't match the ones above
app.get('/events/*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const paginate = require('express-paginate');
app.use(paginate.middleware(1, 50));
app.get('/api/users', users.getUsers);
}