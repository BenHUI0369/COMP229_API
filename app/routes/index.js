const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const usersRouter = require('./user');
const pokemonRouter = require('./pokemon.routes')

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use(pokemonRouter);

module.exports = router;