const auth = require('./auth.controller');
const users = require('./user.controller');
const pokemon = require('./pokemon.controller');
const admin = require('./admin.controller');

module.exports = {
    auth,
    users,
    pokemon,
    admin
};