const {Schema, model} = require('mongoose');

const universiteSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Universite = model('Universite', universiteSchema);