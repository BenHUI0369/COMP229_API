module.exports = (app) => {
    const pokemons = require('../controllers/pokemon.controller.js');

    // create a new pokemon
    app.post('/pokemons', pokemons.create);

    // find by pokemon type
    app.get('/pokemons/find_1', pokemons.findByPokemonTypeMulti);

    // find by pokemon type
    app.get('/pokemons/find_2', pokemons.findByPokemonTypeUnique);
    
    //retrieve all pokemons
    app.get('/pokemons', pokemons.findAll);

    // retrieve a single pokemon by id
    app.get('/pokemons/:id', pokemons.findOne);

    // update a pokemon with id
    app.put('/pokemons/:id', pokemons.update);

    // delete a pokemon by id
    app.delete('/pokemons/:id', pokemons.delete);

    
    
}