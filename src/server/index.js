const startupDebugger = require('debug')('app:startup');
const express = require('express');
const logger = require("./middleware/logger");
const validator = require("./middleware/validator");
const config = require('config');
const todos = require('./routes/todos');
const home = require('./routes/home');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// Config
const port = config.get('port');
startupDebugger(`Application Name: ${config.get('name')}`);

let environment = app.get('env');
startupDebugger(`Environment: ${environment}`);

if(environment === 'development') {
    app.use(logger);
}
app.use(validator);

// routes
app.use('/api/todos', todos);
app.use('/', home);



app.listen(port, () => {
    startupDebugger('listening on port: ' + port);
});