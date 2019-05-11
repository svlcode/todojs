const uuidv4 = require('uuid/v4');
const express = require('express');
const router = express.Router();

let todos = [
    { id: uuidv4() + "", text : 'my first todo', checked: false },
    { id: uuidv4() + "", text : 'my second todo', checked: false },
    { id: uuidv4() + "", text : 'my third todo', checked: false }
];

router.get('/', (req, res) => {
    res.send(todos);
});


//http://localhost:3000/api/todos/2?option1=value1&option2=value2

router.get('/:id', (req, res) => {
    let todo = todos.find((t) => t.id === req.params.id);

    if(!todo) {
        res.status(404).send(`The todo with the id '${req.params.id}' has not been found!`);
    }
    else {
        res.send(todo);
    }
    // res.send(req.query);
    
});

router.post("/", (req, res) => {
    const todo = {
        id: uuidv4(),
        text: req.body.text,
        checked: req.body.checked
    };
    
    console.log(req.body);
    todos.push(todo);
    res.send(todo);
});

router.delete("/:id", (req, res) => {
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

router.put("/:id", (req, res) => {
    
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

module.exports = router;