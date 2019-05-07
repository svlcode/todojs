function log(req, res, next) {
    console.log(`Handling '${req.method}' request on '${req.url}'...`);
    
    next();
}

module.exports = log;