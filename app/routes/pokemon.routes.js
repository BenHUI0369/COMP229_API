const express = require('express');
const controllers = require("../controllers");
const router = express.Router();

router.post("/pokemons/authenticate", controllers.admin.loginUserControllerFn);

  // create account for new user
  router.post("/pokemons/reg", controllers.admin.createAccount);

  // create a new pokemon
  router.post("/pokemons", controllers.pokemon.create);

  // find by pokemon type
  router.get("/pokemons/find_1", controllers.pokemon.findByPokemonTypeMulti);

  // find by pokemon type
  router.get("/pokemons/find_2", controllers.pokemon.findByPokemonTypeUnique);

  //retrieve all pokemons
  router.get("/pokemons", controllers.pokemon.findAll);

  // retrieve a single pokemon by id
  router.get("/pokemons/:id", controllers.pokemon.findOne);

  // update a pokemon with id
  router.put("/pokemons/:id", controllers.pokemon.update);

  // delete a pokemon by id
  router.delete("/pokemons/:id", controllers.pokemon.deletePokemon);

module.exports = router;
/*
module.exports = (app) => {
  const pokemons = require("../controllers/pokemon.controller.js");

  const admins = require("../controllers/admin.controller.js");

  // get admin username and password
  app.post("/pokemons/authenticate", admins.loginUserControllerFn);

  // create account for new user
  app.post("/pokemons/reg", admins.createAccount);

  // create a new pokemon
  app.post("/pokemons", pokemons.create);

  // find by pokemon type
  app.get("/pokemons/find_1", pokemons.findByPokemonTypeMulti);

  // find by pokemon type
  app.get("/pokemons/find_2", pokemons.findByPokemonTypeUnique);

  //retrieve all pokemons
  app.get("/pokemons", pokemons.findAll);

  // retrieve a single pokemon by id
  app.get("/pokemons/:id", pokemons.findOne);

  // update a pokemon with id
  app.put("/pokemons/:id", pokemons.update);

  // delete a pokemon by id
  app.delete("/pokemons/:id", pokemons.deletePokemon);

};
*/