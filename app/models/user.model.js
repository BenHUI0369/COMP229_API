const mongoose = require('mongoose');
const { Schema, model} = mongoose;

// create user model with username, password
// the permission is used to check if the user is admin or not, 0=admin, 1=general user
const userSchema = new Schema({
    username: {type: String, unique: true},
    password: {type: String, select: false},
    permission: {type: Number, enum: [0, 1]}
});

const User = model('User', userSchema);

module.exports = User;