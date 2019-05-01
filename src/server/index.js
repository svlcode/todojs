const port = 3000;

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hello!!!');
});

let todos = [
    { id: "1", text : 'my first todo', checked: false },
    { id: "2", text : 'my second todo', checked: false },
    { id: "3", text : 'my third todo', checked: false },
];

app.get('/api/todos', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(todos);
});

app.get('/api/todos/:id', (req, res) => {
    let todo = todos.find((t) => t.id === req.params.id);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(todo);
});
app.listen(port, () => {
    console.log('listening on port: ' + port);
});