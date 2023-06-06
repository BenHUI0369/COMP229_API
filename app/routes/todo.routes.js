module.exports = (app) => {
    const todos = require('../controllers/todo.controller.js');

    // create a new todo
    app.post('/todo', todos.create);

    //retrieve all todos
    app.get('/todos', todos.findAll);

    // retrieve a single todo by id
    app.get('todos/:id', todos.findOne);

    // update a todo with id
    app.put('/todos/:id', todos.update);

    // delete a todo by id
    app.delete('/todos/:id', todos.delete);
}