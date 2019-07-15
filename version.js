
let version;

exports.version = function(req, res, next) {
    version = req.header('X-Version');
    next();
};

exports.getVersion = function() {
    return version;
}
  