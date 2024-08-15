const {Schema, model} = require('mongoose');
// const jwt = require('jsonwebtoken');

const imageSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    inTheApp: { type: Boolean, default: false},
},{timestamps: true, imageKey: false });

module.exports.Image = model('Image', imageSchema);