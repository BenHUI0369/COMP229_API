// import the Pokemon from models to create Pokemon object
const Pokemon = require('../models/pokemon.model');

// create and save a new pokemon
 let create = (req, res) => {
    // validate request
    if(!req.body) {
        return res.status(400).send({
            message: "Pokemon description can not be empty"
        });
    }

    // create a pokemon
    const pokemon = new Pokemon({
        pokemonID: req.body.pokemonID,
        name: req.body.name || "Untitled Pokemon",
        pokemonType: req.body.pokemonType || "Undefined Type",
        description: req.body.description || "No Description"
    });

    //save pokemon in the database
    //save is the method for mongo db
    pokemon.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating pokemon"
        });
    });
};

// retrieve and return all pokemons from the database
let findAll = (req, res) => {
    //find is the mongo db method
    Pokemon.find()
    .then(pokemons => {
        res.send(pokemons);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occur while retrueving pokemons."
        });
    });
};

// find a single pokemon with an id
let findOne = (req, res) => {
    const id = req.params.id;
    Pokemon.findById(id)
    .then(pokemon => {
        if (!pokemon) {
            return res.status(404).send({
                message: "Pokemon not found with id " + req.params.id
            });
        }
        res.send(pokemon);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Pokemon not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving pokemon with id " + req.params.id
        });
    });
};

//update a pokemon identified by the id in the request
let update = (req, res) => {
    //validate request
    if(!req.body.description) {
        return res.status(400).send({
            message: "Pokemon description can not be empty"
        });
    }

    // find pokemon and update it with the request body
    Pokemon.findByIdAndUpdate(req.params.id, {
        pokemonID: req.body.pokemonID,
        name: req.body.name || "Untitled Pokemon",
        pokemonType: req.body.type || "Undefined Type",
        description: req.body.description
    }, {new: true})
    .then(pokemon => {
        if(!pokemon) {
            return res.status(404).send({
                message: "Pokemon not found with id " + req.params.id
            });
        }
        res.send(pokemon);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Pokemon not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating pokemon with id " + req.params.id
        });
    });
};

// delete a pokemon with the specified id in the request
let deletePokemon = (req, res) => {
    Pokemon.findByIdAndRemove(req.params.id)
    .then(pokemon => {
        if (!pokemon) {
            return res.status(404).send({
                message: "Pokemon not found with id " + req.params.id
            });
        }
        res.send({
            message: "Pokemon deleted successfully!"
        });
    }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Pokemon not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete pokemon with id " + req.params.id
        });
    });
};

// find pokemon by selected type, it will return all pokemon contains the selected type.
// [Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dark, Dragon, Steel and Fairy]
let findByPokemonTypeMulti = (req, res) => {
    // passing the pokemonType to find method
    let findType = req.body.pokemonType;
    Pokemon.find({pokemonType:  { $in: findType }}).then(pokemons => {
        res.send(pokemons);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occur while retrueving pokemons.",
        });
    });
}


let findByPokemonTypeUnique = (req, res) => {
    // passing the pokemonType to find method
    let findType = req.body.pokemonType;
    Pokemon.find({pokemonType:  { $all: findType }}).then(pokemons => {
        res.send(pokemons);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occur while retrueving pokemons.",
        });
    });
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    deletePokemon,
    findByPokemonTypeMulti,
    findByPokemonTypeUnique
};