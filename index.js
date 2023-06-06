const express = require('express');
const bodyParser = require('body-parser');

// create express
const app = express();
// parser application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// parser application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('./config/database.config.js');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connecting to the datebase
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database")
}).catch(err => {
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the app"
    });
});


require('./app/routes/todo.routes.js')(app);

// listen for the require
app.listen(4000, () => {
    console.log("Server is listening on Port: 4000");
});