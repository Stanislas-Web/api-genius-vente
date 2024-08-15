const {Schema, model} = require('mongoose');
// const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    password: { type: String, required: true },
    username: { type: String, required: true },
    number: { type: String, required: true },
    email: {type: String},
    entreprise: {type: String, required: true},
    adress: {type: String, required: true},
    country: {type: String, required: true},
    ville: {type: String, required: true},
    Category: {type: String, required: true},
    whatsapp: {type: String, required: true},
},{timestamps: true, versionKey: false });

module.exports.User = model('User', userSchema);