// import the Todo from models to create Todo object
const Todo = require('../models/todo.model');

// create and save a new todo
exports.create = (req, res) => {
    // validate request
    if(!req.body.description) {
        return res.status(400).send({
            message: "Todo description can not be empty"
        });
    }

    // create a todo
    const todo = new Todo({
        name: req.body.name || "Untitled Todo",
        description: req.body.description
    });

    //save todo in the database
    todo.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating todo"
        });
    });
};

// retrieve and return all todos from the database
exports.findAll = (req, res) => {
    Todo.find()
    .then(todos => {
        res.send(todos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occur while retrueving todos."
        });
    });
};

// find a single todo with an id
exports.findOne = (req, res) => {
    Todo.findById(req.params.id)
    .then(todo => {
        if (!todo) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.id
            });
        }
        res.send(todo);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving todo with id " + req.params.id
        });
    });
};

//update a todo identified by the id in the request
exports.update = (req, res) => {
    //validate request
    if(!req.body.description) {
        return res.status(400).send({
            message: "Todo description can not be empty"
        });
    }

    // find todo and update it with the request body
    Todo.findByIdUpdate(req.params.id, {
        title: req.body.name || "Untitled Todo",
        description: req.body.description
    }, {new: true})
    .then(todo => {
        if(!todo) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.is
            });
        }
        res.send(todo);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.is
            });
        }
        return res.status(500).send({
            message: "Error updating todo with id " + req.params.id
        });
    });
};

// delete a todo with the specified id in the request
exports.delete = (req, res) => {
    Todo.findByIdAndRemove(req.params.id)
    .then(todo => {
        if (!todo) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.id
            });
        }
        res.send({
            message: "Todo deleted successfully!"
        });
    }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Todo not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete todo with id " + req.params.id
        });
    });
};
