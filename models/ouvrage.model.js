
const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');
// const jwt = require('jsonwebtoken');

const ouvrageSchema = new Schema({
    titreOuvrage: { type: String, required: true },
    descriptionOuvrage: { type: String, required: true },
    imageOuvrage: { type: String, required: true },
    lienOuvrage: {type: String, required: true},
    paysOuvrage: {type: String, required: true},
    auteurOuvrage: {type: String, required: true},
    categoryOuvrage: {type: String, required: true},
    typeOuvrage: {type: String, required: true},
    prixOuvrage: {type: Double, required: true},    
},{timestamps: true, versionKey: false });

module.exports.Ouvrage = model('Ouvrage', ouvrageSchema);