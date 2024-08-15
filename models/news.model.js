const {Schema, model} = require('mongoose');
// const jwt = require('jsonwebtoken');

const newsSchema = new Schema({
    news: { type: String, required: true },
    status: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.News = model('News', newsSchema);