const {Schema, model} = require('mongoose');

const splashSchema = new Schema({
    libele: { type: String, required: true },
    image: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Splash = model('Splash', splashSchema);