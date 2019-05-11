const startupDebugger = require('debug')('app:startup');
const express = require('express');
const uuidv4 = require('uuid/v4');
const logger = require("./logger.js");
const validator = require("./validator");
const config = require('config');

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
 

let todos = [
    { id: uuidv4() + "", text : 'my first todo', checked: false },
    { id: uuidv4() + "", text : 'my second todo', checked: false },
    { id: uuidv4() + "", text : 'my third todo', checked: false }
];


app.get('/', (req, res) => {
    res.send('hello!!!');
});


app.get('/api/todos', (req, res) => {
    res.send(todos);
});


//http://localhost:3000/api/todos/2?option1=value1&option2=value2

app.get('/api/todos/:id', (req, res) => {
    let todo = todos.find((t) => t.id === req.params.id);

    if(!todo) {
        res.status(404).send(`The todo with the id '${req.params.id}' has not been found!`);
    }
    else {
        res.send(todo);
    }
    // res.send(req.query);
    
});

app.post("/api/todos", (req, res) => {
    const todo = {
        id: uuidv4(),
        text: req.body.text,
        checked: req.body.checked
    };
    
    console.log(req.body);
    todos.push(todo);
    res.send(todo);
});

app.delete("/api/todos/:id", (req, res) => {
    let todo = todos.find((t) => t.id === req.params.id);
    if(!todo) {
        res.status(404).send(`The todo with the id '${req.params.id}' has not been found!`);
    }
    else {
        const index = todos.indexOf(todo);
        todos.splice(index, 1);
        res.send(`The todo with the id '${req.params.id}' has been deleted!`)
    }
});

app.put("/api/todos/:id", (req, res) => {
    
    let todo = todos.find((t) => t.id === req.params.id);
    if(!todo) {
        res.status(404).send(`The todo with the id '${req.params.id}' has not been found!`);
    }
    else {
        todo.text = req.body.text;
        todo.checked = req.body.checked;
        res.send(todo);
    }
});


app.listen(port, () => {
    startupDebugger('listening on port: ' + port);
});