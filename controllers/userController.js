var users = require('../database/users'),
  getNextId = require('./getNextId');

var nextId = getNextId(users);

exports.updateUser = function(req, res, next) {
  
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;

  req.user.save(function(err) {
    if (err) { return next(err); }

    res.send({ firstName: req.user.firstName,  lastName:req.user.lastName});
    res.end(); 
  });
}

// exports.updateUser = function(req, res) {
//   var updatedUser = req.body;

//   var foundUser = users.find(user => user.id === parseInt(req.params.id));
//   if(foundUser) {
//     foundUser.firstName = updatedUser.firstName;
//     foundUser.lastName = updatedUser.lastName;
//   }

//   res.send(foundUser);
//   res.end();
// }

exports.createUser = function(req, res) {
  var newUser = req.body;
  newUser.id = nextId;
  nextId++;
  users.push(newUser);
  
  res.send(newUser);
  res.end(); 
}

exports.getUsers = function(req, res) {
  res.send(users);
  res.end();
}