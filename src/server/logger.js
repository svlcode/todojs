const requestDebugger = require('debug')('app:requests');

function log(req, res, next) {
    requestDebugger(`Handling '${req.method}' request on '${req.url}'...`);
    next();
}

module.exports = log;