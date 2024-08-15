const {Schema, model} = require('mongoose');
// const jwt = require('jsonwebtoken');

const versionSchema = new Schema({
    android: { type: String, required: true },
    ios: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Version = model('Version', versionSchema);