var auth = require('./auth'),
  events = require('./controllers/eventController'),
  users = require('./controllers/userController');
  path = require('path');

//const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const tokenForUser = require('./utils/token.utils');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
require('./passport')();

var fs = require('fs');


module.exports = function(app) {

  app.post('/api/login', requireSignin, auth.authenticate);
  app.post('/api/signup', auth.signup);

  app.get('/api/currentIdentity', auth.getCurrentIdentity);
  app.put('/api/users/:id', requireAuth, users.updateUser);
  
  app.get('/api/events', events.getEvents);
  app.get('/api/events/:eventId', events.getEvent);
  app.post('/api/events', requireAuth, events.saveEvent);
  app.get('/api/sessions/search', events.searchSessions);
  app.delete('/api/events/:eventId/sessions/:sessionId/voters/:voterId', requireAuth, events.voterAction);
  app.post('/api/events/:eventId/sessions/:sessionId/voters/:voterId', requireAuth, events.voterAction);
  
  app.post('/api/logout', function(req, res) {
    req.logout();
    res.end();
  });
  
  app.post('/api/google',passport.authenticate('google-token', {session: false}), function(req, res) {
      console.log('Start');
      if (!req.user) {
          return res.send(401, 'User Not Authenticated');
      }
      console.log('req.user', req.user);
      req.auth = {
          id: req.user.id
      };
      token = tokenForUser(req.user)
      res.setHeader('x-auth-token', token);
      res.status(200).send(JSON.stringify(req.user));
  });

  app.get('/app/*', function(req, res) {
    res.sendStatus(404);
  });
  
  app.get('/node_modules/*', function(req, res) {
    res.sendStatus(404);
  });

  // app.get('/events/*', function(req, res) {
  //   res.sendFile(path.resolve(__dirname + '/../../dist/index.html'));
  // });
  // app.get('/user/*', function(req, res) {
  //   res.sendFile(path.resolve(__dirname + '/../../dist/index.html'));
  // });
  // app.get('/404', function(req, res) {
  //   res.sendFile(path.resolve(__dirname + '/../../dist/index.html'));
  // });
  // app.get('/', function(req, res) {
  //   res.sendFile(path.resolve(__dirname + '/../../dist/index.html'));
  // });
  
  // Handles any requests that don't match the ones above
app.get('/events/*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

}