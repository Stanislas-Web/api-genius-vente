const {Schema, model} = require('mongoose');

const faculteSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    universite: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Faculte = model('Faculte', faculteSchema);