
const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');
// const jwt = require('jsonwebtoken');

const encadreurSchema = new Schema({
    name: { type: String, required: true },
    cours: { type: String, required: true },
    prix: {type: Double, required: true},
    like: {type: Number, required: true},
    share: {type: Number, required: true},
    biographie: { type: String, required: true },
    image: { type: String, required: true },    
},{timestamps: true, versionKey: false });

module.exports.Encadreur = model('Encadreur', encadreurSchema);