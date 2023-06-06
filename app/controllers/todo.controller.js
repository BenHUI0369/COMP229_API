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
        req.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating todo"
        });
    });
};

// retrieve and return all todos from the database
ecports.finAll = (req, res) => {
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
    Todo.findById
};