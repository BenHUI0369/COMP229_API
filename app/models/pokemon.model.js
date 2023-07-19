const mongoose = require('mongoose');

const PokemonSchema = mongoose.Schema({
    pokemonID: Number,
    name: String,
    pokemonType: [String],
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Pokemon', PokemonSchema);