/** Appel des dépendances et des packages externes */
var mongoose = require('mongoose');

//Format des données :
var Liste = mongoose.model('Liste', {
    text: String,
    done: Boolean,
    date: String,
    creator: String
});

var Categorie = mongoose.model('Categorie', {
    text: String,
    creator: String
});

module.exports = {Liste, Categorie};