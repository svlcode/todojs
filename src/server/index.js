const express = require('express');
const uuidv4 = require('uuid/v4');
const Joi = require('@hapi/joi');

const postSchema = Joi.object().keys({ 
    text: Joi.string().min(3).max(30).required(),
    checked: Joi.boolean().required()
});

const putSchema = postSchema.keys({
    id: Joi.string().required()
});

const port = 3000;

let todos = [
    { id: uuidv4() + "", text : 'my first todo', checked: false },
    { id: uuidv4() + "", text : 'my second todo', checked: false },
    { id: uuidv4() + "", text : 'my third todo', checked: false }
];

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


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

    const result = Joi.validate(req.body, postSchema);
    console.log(result.error);
    if(result.error) {
        // 400  - Bad Request
        return res.status(400).send("'text' is required and should be minimum 3 characters.");
    }
    const todo = {
        id: (todos.length + 1).toString(),
        text: req.body.text,
        checked: req.body.checked
    };
    
    console.log(req.body);
    todos.push(todo);
    res.send(todo);
});

app.delete("/api/todos/:id", (req, res) => {
    // console.log('deleting...');
    // res.send('DELETE request to homepage');
    console.log('Deleting todo: ' + req.params.id);
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
    const result = Joi.validate(req.body, putSchema);
    console.log(result.error);
    if(result.error) {
        // 400  - Bad Request
        return res.status(400).send("Bad Request.");
    }

    console.log('Updating todo: ' + req.params.id);
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
    console.log('listening on port: ' + port);
});