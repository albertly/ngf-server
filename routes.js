var auth = require('./auth'),
  events = require('./controllers/eventController'),
  users = require('./controllers/userController');
  path = require('path');

//const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
  
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
  app.delete('/api/events/:eventId/sessions/:sessionId/voters/:voterId', requireAuth, events.deleteVoter);
  app.post('/api/events/:eventId/sessions/:sessionId/voters/:voterId', requireAuth, events.addVoter);
  
  app.post('/api/logout', function(req, res) {
    req.logout();
    res.end();
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